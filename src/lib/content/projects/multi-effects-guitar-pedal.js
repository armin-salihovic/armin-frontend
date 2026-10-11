export default {
    "slug": "multi-effects-guitar-pedal",
    "title": "Multi Effects Guitar Pedal",
    "description": "Multi-effects guitar processor based on the",
    "position": 1,
    "technologies": [
        "STM32",
        "HAL",
        "C/C++"
    ],
    "card": {
        "desktop": "/projects/multi-effects-guitar-pedal/card.jpg",
        "mobile": "/projects/multi-effects-guitar-pedal/card-mobile.jpg",
        "aspectRatio": "4288/2411"
    },
    "seo": {
        "ogImage": "/og/projects/multi-effects-guitar-pedal.jpg"
    },
    "blocks": [
        {
            "type": "hero-image",
            "desktop": "/projects/multi-effects-guitar-pedal/hero.jpg",
            "mobile": "/projects/multi-effects-guitar-pedal/hero-mobile.jpg",
            "alt": "Dsc 0877 Web",
            "position": "center",
            "eager": false
        },
        {
            "type": "article-title",
            "year": "2022",
            "title": "Multi Effects Guitar Pedal",
            "subtitle": "Low-cost Guitar Effects Pedal Based on ARM Cortex Microcontroller"
        },
        {
            "type": "article-introduction",
            "title": "University SSST",
            "html": "<p>Guitar pedals are devices that change the sound of an electric guitar. The effects that come from the analog domain can be recreated digitally using digital signal processing. Op-amp buffers with filters are used before and after processing the guitar signal.</p><p>Implementation is achieved on the STM32 Nucleo platform with a STM32H7A3ZI MCU capable of clock speeds up to 280MHz. The program is developed using the STM32CubeIDE development tool. The project setup includes setting up the Analog-to-Digital converters, Digital-to-Analog converters, and Direct Memory Access.</p><p>The code infrastructure includes setting up block-based processing with double buffering. The effects implemented are delay, tremolo, and chorus using circular buffers and low low-frequency oscillators.</p><p>The project source code can be found on <a href=\"https://github.com/armin-salihovic/stm32-multi-fx\" rel=\"noopener noreferrer\" target=\"_blank\">GitHub</a>.</p>"
        },
        {
            "type": "article-image",
            "src": "/projects/multi-effects-guitar-pedal/detail-01.jpg",
            "alt": "Dsc 0907 Fixed",
            "frame": false,
            "width": 3799,
            "height": 2138,
            "aspectRatio": "3799/2138"
        },
        {
            "type": "paragraph",
            "title": "Implemented effects",
            "html": "<p class=\"ql-align-justify\">The effects chosen for implementation are Delay, Tremolo, and Chorus.</p><p>The delay effect is a simple effect that utilizes a circular buffer, while the tremolo utilizes the LFO. In contrast, the chorus effect uses both the circular buffer and the LFO, making it a hybrid of delay and tremolo.</p>"
        },
        {
            "type": "article-image",
            "src": "/projects/multi-effects-guitar-pedal/detail-02.jpg",
            "alt": "Dsc 0915 Web",
            "frame": false,
            "width": 4288,
            "height": 2411,
            "aspectRatio": "4288/2411"
        },
        {
            "type": "paragraph",
            "title": "User interface",
            "html": "<p>The user interface allows the user to interact with the guitar pedal. </p><p>For example, users can turn on and off the effects unit using a footswitch. Additionally, users can switch from one effect to another using the rotary encoder (purple knob), i.e., have the multi-effects functionality. Finally, users can adjust the effects parameters such as delay time and delay feedback using the three remaining potentiometers (black knobs).</p><p>The current effect is displayed on the LCD screen.<br class=\"softbreak\"></p>"
        },
        {
            "type": "article-image",
            "src": "/projects/multi-effects-guitar-pedal/detail-03.jpg",
            "alt": "Dsc 0882 Web",
            "frame": false,
            "width": 4288,
            "height": 2411,
            "aspectRatio": "4288/2411"
        }
    ]
};
