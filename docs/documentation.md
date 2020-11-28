# Modelify Docs

## Modelify.info(message, bgColor)
 - message: string: message to display
 - bgColor: string of "rgb()" or "#HEX": background color of modal
Message is displayed in a closable modal.
Returns a `Promise` that is resolved when closed.

## Modelify.prompt(msg, option1="No", option2="Yes", options)
 - msg: string: message to display
 - option1: string: text for option1 (red) (Default="No")
 - option2: string: text for option2 (green) (Default="Yes")
 - options: object: object of options for prompt
```
options: {
    // determine if modal fades out and shrinks or just disappears (Default = false)
    smoothClose: true | false
    // set a custom background color (Default = "#008eff")
    bgColor: "rgb()" | "#HEX"
    // choose if an X appears to close the modal (Default = true)
    closable: true | false
}
```
Message is displayed in a closable modal with a negative option (Defaults to "No") and a positive option (Defaults to "Yes").
Returns a `Promise` that **rejects** with "close" when closed
and **resolves** to the option title string when an option is chosen.

## Modelify.choose(msg, choices, options)
 - msg: string: message to display
 - choices: array: names of options to display
 - options: object: object of options for prompt
```
options: {
    // determine if modal fades out and shrinks or just disappears (Default = false)
    smoothClose: true | false
    // set a custom background color (Default = "#008eff")
    bgColor: "rgb()" | "#HEX"
    // choose if an X appears to close the modal (Default = true)
    closable: true | false
    // **ONLY AVAILABLE FOR Modelify.choose() :**
    // Array of colors for the choices
    choiceColors: []
}
```
Message is displayed in a closable modal with the choices displayed below.
Returns a `Promise` that **rejects** with "close" when closed
and **resolves** to the option title string when an option is chosen.

## Modelify.modalIsOpen()
Returns a boolean identifying if one or more modals is currently being displayed.