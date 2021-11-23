"use strict";

function onCreate() {
    glitter.share.code = {
        kotlin: function (text) {
            return this.getCode('kotlin', text)
        },
        swift: function (text) {
            return this.getCode('swift', text)
        },
        java: function (text) {
            return this.getCode('java', text)
        },
        js: function (text) {
            return this.getCode('javascript', text)
        },
        div: function (text) {
            return `<div style="background-color: whitesmoke;width: 100%;padding: 20px;border-radius: 10px;">${text}</div>`
        },
        getCode: function (type, text) {
            return `
<pre style=" display:inline-block;width: 100%;margin: 0;">
<code class="${type}" style="text-align: left;clear: both;width: max-content;min-width: 100%;">
${text}
</code>
</pre>
`
        }
    }
    glitter.setHome('page/Doc_Index.html', 'Doc_Index', {})
}







