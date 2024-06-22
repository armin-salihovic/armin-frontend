function start(parent = null) {
    parent = parent ? parent : document;

    const blurDivs = parent.querySelectorAll('.blur-div')
    blurDivs.forEach(div => {
        if (!div.classList.contains('loaded')) {
            const img = div.querySelector('img')

            function loaded() {
                div.classList.add('loaded')
            }

            if (img.complete) {
                setTimeout(()=>{
                    loaded();
                }, 200)
            } else {
                img.addEventListener('load', loaded)
            }
        }
    })
}

export const useLazyLoading = () => {  return {
    start,
}}
