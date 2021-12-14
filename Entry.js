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
    glitter.share.naviGation = [
        {
            title: '開始', items: [
                {title: '關於Glitter', link: '../frag/Frag_About.html'},
                // {title: '開發者資訊', link: '../frag/Frag_My_Info.html'},
                {title: '下載與引用', link: '../frag/Frag_Download_Project.html'},
                {title: '安卓配置', link: '../android/Frag_Sdk_Initial.html'},
                {title: 'IOS配置', link: '../ios/Frag_Sdk_Initial.html'}
            ]
        }, {
            title: '開發組件', items: [
                {title: '進入點', link: '../Development/Frag_Entry.html'},
                {title: '畫面的繪製', link: '../Development/Frag_View_Paint.html'},
                {title: '頁面的切換', link: '../Development/Frag_Switch_Page.html'},
                {title: '片段與視窗', link: '../Development/Frag_Frag.html'},
                {title: 'MVVM雙向綁定', link: '../Development/Frag_View_Binding.html'},
                {title: '資料的傳遞', link: '../Development/Frag_DataTransFer.html'}
            ]
        }, {
            title: '通用插件', items: [
                {title: '藍芽', link: '../plugins/bluetooth.html'},
                {title: '資料庫', link: '../plugins/DataBase.html'},
                {title: '檔案存取', link: '../plugins/FileManager.html'}
            ]
        }, {
            title: 'Android插件', items: [
                {title: 'Permission', link: '../android/plugins/Permission.html'}
            ]
        }, {
            title: 'IOS插件', items: []
        }
    ]
    glitter.setHome('page/Doc_Index.html', 'Doc_Index', {})
}







