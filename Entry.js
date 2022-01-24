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
                {title: '開發者資訊', link: 'https://github.com/sam38124'},
                {title: '前端配置', link: '../frag/Frag_Download_Project.html'},
                {title: '安卓配置', link: '../android/Frag_Sdk_Initial.html'},
                {title: 'IOS配置', link: '../ios/Frag_Sdk_Initial.html'},
                {title: '後端配置', link: '../frag/Frag_Back_Initial.html'}
            ]
        }, {
            title: 'H5開發', items: [
                {title: '進入點', link: '../Development/Frag_Entry.html'},
                {title: '產生頁面', link: '../Development/Frag_View_Paint.html'},
                {title: '頁面的切換', link: '../Development/Frag_Switch_Page.html'},
                {title: '頁面控制', link: '../Development/Frag_Page_Getter.html'},
                {title: '片段與視窗', link: '../Development/Frag_Frag.html'},
                {title: '資料傳遞', link: '../Development/Frag_DataTransFer.html'},
                {title: '資料綁定', link: '../Development/Frag_DataBinding.html'},
                {title: 'MVVM雙向綁定', link: '../Development/Frag_View_Binding.html'},
                {title: 'URL控制', link: '../Development/Frag_URL_Controler.html'},
                {title: '事件控制', link: '../Development/Frag_Event.html'},
                {title: '無限列表', link: '../Development/Frag_InfiniateList.html'}
            ]
        },{
            title: '後端開發', items: [
                {title: '取得資料',link:''}
            ]
        },
        {
            title: 'Android & IOS插件', items: [
                {title: '開發Glitter插件', link: '../plugins/Develop_My_Plugin.html'},
                {title: '調用Glitter插件', link: '../plugins/NativeFunction.html'},
                {title: '裝置資訊', link: '../plugins/DeviceInfo.html'},
                {title: '資料存取', link: '../plugins/DataManager.html'},
                {title: '藍芽', link: '../plugins/bluetooth.html'},
                {title: '資料庫', link: '../plugins/DataBase.html'},
                {title: '檔案存取', link: '../plugins/FileManager.html'},
                {title: '聲音播放', link: '../plugins/SoundManager.html'},
                {title: '權限請求', link: '../android/plugins/Permission.html'},
                {title: '定位功能', link: '../plugins/GpsManager.html'}
            ]
        }
    ]
    glitter.setHome('page/Doc_Index.html', 'Doc_Index', {})
}







