/**
 * Modelify.js 1.1.0
 * Created by Elijah Mock
 * https://github.com/92Eli/modelify
 * 
 */

(function() {
    let modalOpen = false; // to start
    let modalsOpen = 0;
    function modalOpened() {
        modalsOpen++;
        maybeAddBg();
    }
    function modalClosed() {
        modalOpen = (--modalsOpen === 0) ? false : true;
        if (!modalOpen) {
            try {
                document.body.removeChild(document.querySelector(".modelify-bg"));
            } catch (e) {
                console.error("Modelify error:", e); // should not run
            }
        }
    }
    function maybeAddBg() {
        if (modalsOpen <= 1) {
            // need bg
            const z = document.createElement("div");
            z.classList.add("modelify-bg");
            //z.addEventListener("click", ()=>{}); // remove top prompt if closable
            document.body.appendChild(z);
        }
    }

    function removeElementSafe(el) {
        try {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            } else {
                // else already gone
                //console.log("Modelify: element is already gone (no-op).");
            }
        } catch (e) {
            // might already be gone
            console.error("Modelify error removing an element:", e);
        }
    }
    function clearModal(modalElement, smooth, noDelay) {
        if (!smooth) {
            if (noDelay == true) {
                // no delay
                removeElementSafe(modalElement);
                modalClosed();
            } else {
                setTimeout(() => {
                    removeElementSafe(modalElement);
                    modalClosed();
                }, 100); // let them see popdown first
            }
        } else {
            modalElement.classList.add("zoom-out");
            z.classList.add("fade-out");
            setTimeout(() => {
                removeElementSafe(modalElement);
                modalClosed();
            }, 250); // let them see zoom effect
        }
    }
    function closableListener(element, closeButton, onClose) {
        return new Promise((res, rej) => {
            if (onClose === undefined) {
                onClose = () => {
                    removeElementSafe(element);
                    //document.body.removeChild(z);
                    modalClosed();
                };
            }
            closeButton.addEventListener("click", handleClose);
            window.addEventListener("keyup", checkAndClose); // clear on Esc too
            function checkAndClose(e) {
                if (e.key === "Escape") {
                    handleClose();
                }
            }
            function handleClose() {
                onClose();
                window.removeEventListener("keyup", checkAndClose);
                // don't need to remove c evt listener, parent removed from DOM
                res("closed");

            }
        });
    }
    
    function info(msg, bgColor, fontSize) {
        modalOpened();
        const a = document.createElement("div");
        const c = document.createElement("div");
        const m = document.createElement("p");
        
        a.classList.add("modelify");
        c.classList.add("modelify-close");
        m.classList.add("main");
    
        if (bgColor) a.style.backgroundColor = bgColor;
        if (fontSize) a.style.fontSize = fontSize;
    
        m.textContent = msg;

        a.appendChild(c);
        a.appendChild(m);
        document.body.appendChild(a);

        return closableListener(a, c);
    }

    function infoWithTitle(msg, title, bgColor, fontSize) {
        modalOpened();
        const a = document.createElement("div");
        const c = document.createElement("div");
        const t = document.createElement("p");
        const m = document.createElement("p");
        
        a.classList.add("modelify");
        c.classList.add("modelify-close");
        t.classList.add("main");
        m.classList.add("sub");
    
        if (bgColor) a.style.backgroundColor = bgColor;
        if (fontSize) a.style.fontSize = fontSize;
        //t.style.fontSize = "2em"; // todo put in CSS instead
    
        t.textContent = title;
        m.textContent = msg;

        a.appendChild(c);
        a.appendChild(t);
        a.appendChild(m);
        document.body.appendChild(a);

        return closableListener(a, c);
    }

    /*
    options {
        smoothClose: true | false
        bgColor: "rgb()" | "#HEX"
        closable: true | false
        // ONLY AVAILABLE FOR Modelify.choose() :
        choiceColors: []
    }
    */
    function basicPrompt(msg, option1="No", option2="Yes", options) {
        modalOpened();
        const a = document.createElement("div");
        const c = document.createElement("div");
        const m = document.createElement("p");
        const ops = document.createElement("div");
        const o1 = document.createElement("div");
        const o2 = document.createElement("div");
        
        a.classList.add("modelify");
        c.classList.add("modelify-close");
        m.classList.add("main");
        ops.classList.add("ops-container");
        o1.classList.add("option");
        o1.classList.add("pushy__btn","pushy__btn--red");
        o2.classList.add("option");
        o2.classList.add("pushy__btn","pushy__btn--green");
    
        let smoothly = false,
            closable = true;;
        if (options != undefined) {
            if (options.hasOwnProperty("bgColor")) a.style.backgroundColor = options.bgColor;
            //if (options == undefined || !options.hasOwnProperty("smooth")) options.smooth = false;
            if (options.hasOwnProperty("smoothClose")) smoothly = options.smoothClose;
            if (options.hasOwnProperty("closable")) closable = options.closable;
        }
    
        m.textContent = msg;
        o1.textContent = option1;
        o2.textContent = option2;

        const p = new Promise((res, rej) => {
            closableListener(a, c, () => clearModal(a, smoothly, true)).then(r => rej(r)); // on close, reject prompt
            o1.addEventListener("click", () => {
                clearModal(a, smoothly);
                res(false); // 0th op
            });
            o2.addEventListener("click", () => {
                clearModal(a, smoothly);
                res(true); // 1st op
            });
        });
    
        if (closable) a.appendChild(c);
        a.appendChild(m);
        ops.appendChild(o1);
        ops.appendChild(o2);
        a.appendChild(ops);
        document.body.appendChild(a);
    
        return p;
    }
    
    function choose(msg, choices, options) {
        modalOpened();
        const a = document.createElement("div");
        const c = document.createElement("div");
        const m = document.createElement("p");
        const ops = document.createElement("div");
        
        a.classList.add("modelify");
        c.classList.add("modelify-close");
        m.classList.add("main");
        ops.classList.add("ops-container");
    
        
        
        let smoothly = false,
            closable = true,
            choiceColors = [],
            larger = false;
        if (options != undefined) {
            if (options.hasOwnProperty("bgColor")) a.style.backgroundColor = options.bgColor;
            if (options.hasOwnProperty("smoothClose")) smoothly = options.smoothClose;
            if (options.hasOwnProperty("closable")) closable = options.closable;
            if (options.hasOwnProperty("choiceColors") && Array.isArray(choiceColors)) choiceColors = options.choiceColors;
            if (options.hasOwnProperty("larger")) larger = options.larger;
        }
        if (!Array.isArray(choices)) choices = []; // idk why you'd do this (throw?)
    
        if (larger) a.style.width = "75%";
        m.textContent = msg;
    
        function clearModal(smooth, noDelay) {
            if (!smooth) {
                if (noDelay == true) {
                    // no delay
                    document.body.removeChild(a);
                    modalClosed();
                } else {
                    setTimeout(() => {
                        document.body.removeChild(a);
                        modalClosed();
                    }, 100); // let them see popdown first
                }
            } else {
                a.classList.add("zoom-out");
                if (modalsOpen == 1) {
                    // last modal
                    document.querySelector(".modelify-bg").classList.add("fade-out");
                }
                setTimeout(() => {
                    document.body.removeChild(a);
                    modalClosed();
                }, 250); // let them see zoom effect
            }
        }
    
        const p = new Promise((res, rej) => {
            c.addEventListener("click", () => {
                clearModal(smoothly, true);
                rej("closed");
            });
            //for (const oTitle in choices) { // have to loop here where we have access to res()
            for (let i = 0; i < choices.length; i++) { // have to loop here where we have access to res()
                const o = document.createElement("div");
                o.classList.add("option");
                o.classList.add("pushy__btn","pushy__btn--red");
                
                o.textContent = choices[i];
                if (choiceColors[i] != undefined) {
                    o.style.backgroundColor = choiceColors[i];
                }
    
                o.addEventListener("click", () => {
                    clearModal(smoothly);
                    res(choices[i]); // resolve with name
                });
                
                ops.appendChild(o);
            }
        });
    
        if (closable) a.appendChild(c);
        a.appendChild(m);
        a.appendChild(ops);
        document.body.appendChild(a);
    
        return p;
    }
    function chooseImg(msg, urls, options) {
        modalOpened();
        const a = document.createElement("div");
        const c = document.createElement("div");
        const m = document.createElement("p");
        const ops = document.createElement("div");
        
        a.classList.add("modelify");
        c.classList.add("modelify-close");
        m.classList.add("main");
        ops.classList.add("ops-container");
        
        let smoothly = false,
            closable = true,
            choiceColors = [],
            larger = false;
        if (options != undefined) {
            if (options.hasOwnProperty("bgColor")) a.style.backgroundColor = options.bgColor;
            if (options.hasOwnProperty("smoothClose")) smoothly = options.smoothClose;
            if (options.hasOwnProperty("closable")) closable = options.closable;
            if (options.hasOwnProperty("choiceColors") && Array.isArray(choiceColors)) choiceColors = options.choiceColors;
            if (options.hasOwnProperty("larger")) larger = options.larger;
        }
        if (!Array.isArray(urls)) urls = []; // idk why you'd do this (throw?)
    
        if (larger) a.style.width = "85%";
        m.textContent = msg;
    
        function clearModal(smooth, noDelay) {
            if (!smooth) {
                if (noDelay == true) {
                    // no delay
                    document.body.removeChild(a);
                    modalClosed();
                } else {
                    setTimeout(() => {
                        document.body.removeChild(a);
                        modalClosed();
                    }, 100); // let them see popdown first
                }
            } else {
                a.classList.add("zoom-out");
                if (modalsOpen == 1) {
                    // last modal
                    document.querySelector(".modelify-bg").classList.add("fade-out");
                }
                setTimeout(() => {
                    document.body.removeChild(a);
                    modalClosed();
                }, 250); // let them see zoom effect
            }
        }
    
        const p = new Promise((res, rej) => {
            c.addEventListener("click", () => {
                clearModal(smoothly, true);
                rej("closed");
            });
            for (let i = 0; i < urls.length; i++) { // have to loop here where we have access to res()
                const o = document.createElement("img");
                o.classList.add("option");
                o.classList.add("pushy__btn","pushy__btn--red");
                
                o.src = urls[i];
                if (choiceColors[i] != undefined) {
                    o.style.backgroundColor = choiceColors[i];
                }
    
                o.addEventListener("click", () => {
                    clearModal(smoothly);
                    res(urls[i]); // resolve with url
                });
                
                ops.appendChild(o);
            }
        });
    
        if (closable) a.appendChild(c);
        a.appendChild(m);
        a.appendChild(ops);
        document.body.appendChild(a);
    
        return p;
    }



    window.Modelify = {
        info: info,
        infoWithTitle: infoWithTitle,
        prompt: basicPrompt,
        choose: choose,
        chooseImg: chooseImg,
        modalIsOpen: () => modalOpen,
    };
})();