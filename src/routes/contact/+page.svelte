<script>
    import MainLayout from "../../components/MainLayout.svelte";
    import PageHeader from "../../components/PageHeader.svelte";
    import MessageBox from "../../components/MessageBox.svelte";
    import {settings} from "../../store.js";
    import Seo from "../../components/Seo.svelte";
    import {PUBLIC_API_BASE_URL} from '$env/static/public';

    let messageBox = {
        open: false,
        type: '',
        message: {
            title: '',
            content: [],
        }
    };

    let emailData = {
        name: '',
        email: '',
        subject: '',
        message: '',
    };

    $: validateEmail(emailData.email);

    function clearEmailData() {
        emailData.name = '';
        emailData.email = '';
        emailData.subject = '';
        emailData.message = '';
    }

    let submitted = false;
    let sending = false;

    async function sendEmail() {
        submitted = true;

        if(validateForm() || sending) return;

        sending = true;

        try {
            await fetch(`${PUBLIC_API_BASE_URL}/send-email`,{
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData),
            });

            sending = false;
            submitted = false;
            openMessageBox('success', 'Message Sent!', ['Thanks for reaching out!', 'I\'ll get back to you as soon as possible! :)']);
            clearEmailData();
        } catch (e) {
            if(e.data === undefined || e.data.errors === undefined) {
                openMessageBox('fail', 'Unexpected Server Error', ['Oops... This is embarrassing... :(', `Please email me directly at <a class="underline" target="_blank" rel="noreferrer" href="mailto:${$settings['social_email']}">${$settings['social_email']}</a>`]);
            } else {
                const errors = [];
                for (let err of Object.keys(e.data.errors)) {
                    errors.push(e.data.errors[err][0]);
                }
                openMessageBox('fail', 'Error!', errors);
            }
        }
    }

    function closeMessageBox() {
        messageBox.open = false;
        messageBox = messageBox;
    }

    function openMessageBox(type, title, content) {
        messageBox = {
            open: true,
            type: type,
            message: {
                title: title,
                content: content,
            }
        }
    }

    let validations = {
        name: {
            errors: false,
            message: null,
        },
        email: {
            errors: false,
            message: null,
        },
        subject: {
            errors: false,
            message: null,
        },
        message: {
            errors: false,
            message: null,
        },
    };

    function validateForm() {
        validateName();
        validateSubject();
        validateMessage();
        validateEmail();
        return formHasErrors();
    }

    function validateName() {
        if(!submitted) return;

        if(emailData.name === '') {
            validations.name.errors = true;
            validations.name.message = 'Name is required';
        } else {
            validations.name.errors = false;
        }
    }

    function validateSubject() {
        if(!submitted) return;

        if(emailData.subject === '') {
            validations.subject.errors = true;
            validations.subject.message = 'Subject is required';
        } else {
            validations.subject.errors = false;
        }
    }

    function validateMessage() {
        if(!submitted) return;

        if(emailData.message === '') {
            validations.message.errors = true;
            validations.message.message = 'Message is required';
        } else {
            validations.message.errors = false;
        }
    }

    function validateEmail() {
        if(!submitted) return;

        const emailRegex = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';

        if(emailData.email === '') {
            validations.email.errors = true;
            validations.email.message = 'Email is required'
        } else if(!emailData.email.match(emailRegex)) {
            validations.email.errors = true;
            validations.email.message = 'Value is not a valid email address'
        } else {
            validations.email.errors = false;
        }
    }

    const formHasErrors = () => validations.name.errors || validations.subject.errors || validations.message.errors || validations.email.errors;
</script>

<MainLayout>
    <div class="p-6 sm:px-12 3xl:px-16 4xl:px-24">
        <Seo title="{$settings['contact_meta_title']}" metaDescription="{$settings['contact_meta_description']}" ogImg="{$settings['contact_og']}" />
        <PageHeader title="Contact" />
        <div class="flex pb-16 3xl:pb-20 4xl:pb-32 grid grid-cols-6 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl gap-4 3xl:gap-5 4xl:gap-8">
            <aside class="md:col-span-2 col-span-6">
                <h4 class="font-bold">Write me a message!</h4>
            </aside>
            <div class="md:col-span-3 col-span-6">
                <div class="mb-10 3xl:mb-12 4xl:mb-20 w-full flex flex-col sm:flex-row">
                    <div class="flex flex-col w-full sm:w-1/2 mb-10 sm:mb-0 sm:pr-5 3xl:pr-7 4xl:pr-10">
                        <input bind:value="{emailData.name}" on:keyup="{validateName}" on:focus="{closeMessageBox}" class="{validations.name.errors ? 'border-red-500' : 'border-black focus:border-green-400'} py-2 3xl:py-2.5 4xl:py-4 border-b text-gray-600 placeholder-gray-400 outline-none" id="name" type="text" placeholder="Name">
                        {#if validations.name.errors}
                            <small class="text-red-500">{ validations.name.message }</small>
                        {/if}
                    </div>
                    <div class="flex flex-col w-full sm:w-1/2 sm:pl-5 3xl:pl-7 4xl:pl-10">
                        <input bind:value="{emailData.email}" on:focus="{closeMessageBox}" class="{validations.email.errors ? 'border-red-500' : 'border-black focus:border-green-400'} py-2 3xl:py-2.5 4xl:py-4 border-b text-gray-600 placeholder-gray-400 outline-none" id="email" type="email" placeholder="Email">
                        {#if validations.email.errors}
                            <small class="text-red-500">{ validations.email.message }</small>
                        {/if}
                    </div>
                </div>
                <div class="flex flex-col w-full mb-10 3xl:mb-12 4xl:mb-20">
                    <input bind:value="{emailData.subject}" on:keyup="{validateSubject}" on:focus="{closeMessageBox}" class="{validations.subject.errors ? 'border-red-500' : 'border-black focus:border-green-400 '} py-2 3xl:py-2.5 4xl:py-4 border-b text-gray-600 placeholder-gray-400 outline-none" id="subject" type="text" placeholder="Subject">
                    {#if validations.subject.errors}
                        <small class="text-red-500">{ validations.subject.message }</small>
                    {/if}
                </div>
                <div class="flex flex-col w-full mb-5 3xl:mb-7 4xl:mb-10">
                    <textarea bind:value="{emailData.message}" on:keyup="{validateMessage}" on:focus="{closeMessageBox}" placeholder="Message" class="{validations.message.errors ? 'border-red-500' : 'border-black focus:border-green-400'} h-48 3xl:h-64 4xl:h-96 resize-none py-2 3xl:py-2.5 4xl:py-4 border-b text-gray-600 placeholder-gray-400 outline-none"></textarea>
                    {#if validations.message.errors}
                        <small class="text-red-500">{ validations.message.message }</small>
                    {/if}
                </div>
                <button on:click="{sendEmail}" class="py-2 3xl:py-2.5 4xl:py-4 px-10 3xl:px-12 4xl:px-20 mr-2 3xl:mr-2.5 4xl:mr-4 mb-2 3xl:mb-2.5 4xl:mb-4 text-base font-bold focus:outline-none bg-white border border-black focus:z-10 focus:ring-4 focus:ring-gray-200 transition ease-in-out {sending ? 'bg-black text-white cursor-not-allowed' : 'hover:bg-black hover:text-white'}" disabled='{sending}'>
                    {#if sending}
                        <img class="animate-paw-wave icon-white h-5 3xl:h-7 4xl:h-10" src="/img/icon-paw.svg" alt="icon paw">
                    {:else}
                        <span>Send</span>
                    {/if}
                </button>
            </div>
        </div>
        <MessageBox open="{messageBox.open}" message="{messageBox.message}" type="{messageBox.type}" on:close={closeMessageBox} />
    </div>
</MainLayout>
