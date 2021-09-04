var ListItem = createReactClass({
    getDefaultProps: function() {},
    render: function() {
        if(this.props.data===undefined){
            return  ``
        }
        var that=this
        var element=[]
        this.props.data.map(function (data){
            try{
                if(data.circle==="5"){
                    if(typeof(data.titleImage)==='string'){
                        data.titleImage=JSON.parse(data.titleImage)
                        data.image=data.titleImage
                    }
                }else{
                    if(typeof(data.image)==='string'){
                        data.image=JSON.parse(data.image)
                    }
                }
            }catch (e){

            }
            if ((data.image === undefined) || data.image.length === 0) {data.image = ["../img/noimage.png"]}
            element.push(<div className={"gridItem"}  onMouseDown={function (e) {
                if(that.preventClick){return}
                glitter.changePage('publicResource/page/Page_IG_ShowArticle.html', 'Page_IG_ShowArticle', true, {
                    toAccount: data.account,
                    firstArticle:data.id,
                    index: '-1',
                    notCode: ['10']
                })
            }}>
                <div className="itemImg"><img src={`${data.image[0]}`}></img></div>
            </div>)
        })
        if(that.props.index===0){
            return  <div id={`list-item${this.props.index}`} dangerouslySetInnerHTML={{__html:getTopView()}}></div>
        }else{
            return <div className="infinite-list-item" id={`list-item${this.props.index}`}>
                {element}
            </div>
        }
    },
    preventClick:false,
    componentDidMount:function (){
        if($(`#list-item${this.props.index}`).get(0)){
            let height=$(`#list-item${this.props.index}`).height()
            if(height!==undefined){
                publicShare.changeItemHeight(this.props.index,height)
            }
        }
    }
});
var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    getInitialState: function() {
        return {
            elementHeights: [0],
            isInfiniteLoading: false,
            data:[{id:"-1"},{id:"-1"},{id:"-1"}],
            adData:[],
            isBtn:false,
            code:undefined
        };
    },
    generateVariableElementHeights: function(number,height) {
        var heights = [];
        for (var i = 0; i < number; i++) {
            heights.push(height);
        }
        return heights;
    },
    handleInfiniteLoad: function() {
        if(this.state.isInfiniteLoading||this.state.isBtn){return}
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        //取得文章內容
        function getArticle(){
            glitter.publicBeans.publicLogic.getArticle({
                index:(that.state.data.length === 0) ? "-1" : (that.state.data[that.state.data.length - 1].id),
                toAccount:userData.account,
                notCode: ["10"]
            },function (response){
                if(response===undefined){
                    that.setState({
                        isInfiniteLoading: false
                    });
                    that.handleInfiniteLoad()
                }else{
                    let item = response["data"]
                    if(item.length===0){
                        that.state.isBtn=true
                        that.setState({
                            isInfiniteLoading: false
                        });
                    }else{
                        that.setState({
                            isInfiniteLoading: false,
                            elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length/3,10)),
                            data:that.state.data.concat(item)
                        });
                    }
                }
            })
        }
        getArticle()
    },
    elementInfiniteLoad: function() {
        if(this.state.isBtn){return ``}
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function() {
        var that=this
        reloadData=function (code){
            that.setState({
                elementHeights: [50],
                isInfiniteLoading: false,
                data:[{id:"-1"},{id:"-1"},{id:"-1"}],
                index:"-1",
                isBtn:false,
                code:code
            })
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight=function (index,height){
            if(height<=that.state.elementHeights[index]){return}
            that.state.elementHeights[index]=height
            that.setState({});
        }
        let elements = this.state.elementHeights.map(function(el, i) {
            let dataIs=[]
            for(var a=0;a<3;a++){
                if(that.state.data[i*3+a]!==undefined){dataIs.push(that.state.data[i*3+a])}
            }
            return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={dataIs}/>;
        })
        if(that.state.elementHeights.length===1 && that.state.isBtn){
            return <div dangerouslySetInnerHTML={{__html: `${getTopView()}<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無內容...</h3>`}}></div>
        }
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={height}
                infiniteLoadBeginEdgeOffset={200}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={100}
            >
                {elements}
            </Infinite>;
    }
});

var reloadData=function (code){}
var height=0
var userData = undefined
var userJson= undefined
function createView(){
    let timer=setInterval(function (){
        if(document.getElementById('infinite-example-two')){
            height=$('#infinite-example-two').height()
            ReactDOM.render(<VariableInfiniteList/>,document.getElementById('infinite-example-two'));
            clearInterval(timer)
        }
    },100)
}




//個人檔案View
function getTopView(){
    return `<div style="width: 100%;display: flex;flex-direction: column;align-items: center;">
<div class="topFlex">
<img alt="變更大頭貼照" class="be6sR" src="${userData.head}">
<div style="flex: auto;height: 100%;display:flex;flex-direction: column;align-items: center;justify-content: center;">
<div class="intopFlex">
<h3>${userData.postArticle}</h3>
<h3 onmousedown=" glitter.changePage('publicResource/page/Page_Show_User.html','Page_Show_User',true,{
     textTitle:'粉絲',
        titleBar:false,
        excute:glitter.publicBeans.publicLogic.getMyFollow,
        data:{}
      })">${userData.Follow}</h3>
<h3 onmousedown=" glitter.changePage('publicResource/page/Page_Show_User.html','Page_Show_User',true,{
        textTitle:'追蹤中',
        titleBar:false,
        excute:glitter.publicBeans.publicLogic.getMyFriend,
        data:{}
      })">${userData.toFollow}</h3>
</div>
<div class="intopFlex">
<h4>貼文</h4>
<h4 >粉絲</h4>
<h4>追蹤中</h4>
</div>
</div>
</div>
<div id="myinfo" onclick="$('#myinfo').toggleClass('visible');" class="-vDIg">
<h1>${(userData.pick)}</h1>
${(userJson.introduce !== undefined) ? (userJson.introduce).replaceAll("\n","<br>") : ''}
</div>
<div class="bt_in3">
${(userData.account===glitter.publicBeans.publicLogic.customDefine.user_data.account)
    ?
    `<div onclick="glitter.changePage('publicResource/page/Page_Edit_My_Info.html','Page_Edit_My_Info',true,{})">編輯個人檔案</div>
<div onclick="  glitter.changePage('publicResource/page/Page_IG_ShowArticle.html', 'Page_IG_ShowArticle', true, {
                                        mySub: true,
                                        index: '-1',
                                        notCode: ['10']
                                    })">我的收藏</div>`:`
<div id="follow" style="background-color: dodgerblue;color: white;" onclick="
                                glitter.share.dataLoading(true)
                                let excute=(glitter.publicBeans.publicLogic.customDefine.myFollow.filter(function (dd) {
            return dd.account === userData.account
        }).length === 0 && (userData.manager !== '1') && (userData.account !== glitter.publicBeans.publicLogic.customDefine.account)) ? 'add':'delete'
                                glitter.publicBeans.publicLogic.addFriend({
                                    execute:excute ,
                                    toAccount: userData.account
                                }, function (response) {
                                    glitter.share.dataLoading(false)
                                    if (response === undefined) {
                                        glitter.share.internetError()
                                    }
                                    if (response.result) {
                                        if(excute==='add'){
                                             glitter.publicBeans.publicLogic.customDefine.myFollow.push({account:userData.account}) 
                                        }else{
                                             glitter.publicBeans.publicLogic.customDefine.myFollow=glitter.publicBeans.publicLogic.customDefine.myFollow.filter(function (data){
                                                return  data.account!==userData.account
                                             })
                                        }
                                      
                                        $('#follow').html((excute==='add') ? '已追蹤':'追蹤')
                                    }
                                })
                            ">
${(glitter.publicBeans.publicLogic.customDefine.myFollow.filter(function (dd) {
            return dd.account === userData.account
        }).length === 0 && (userData.manager !== "1") && (userData.account !== glitter.publicBeans.publicLogic.customDefine.account)) ? "追蹤":"已追蹤"}
</div>
<div onclick=" glitter.share.dataLoading(true)
                    glitter.publicBeans.publicLogic.addChat({
                        toAccount:userData.account
                    },function (response){
                        glitter.share.dataLoading(false)
                        if(response===undefined){
                            glitter.share.hint('請檢察網路連線!!')
                        }else{
                            if(response.result){
                                gBundle.link=response.link
                                glitter.changePage('publicResource/page/Page_Show_User_Message_0.html','Page_Show_User_Message_0',true,userData)
                            }else{
                                glitter.share.hint('發生錯誤!!')
                            }
                        }
                    })">發訊息</div>`}

</div>
</div>
<div class="fx7hk"></div>`
}

