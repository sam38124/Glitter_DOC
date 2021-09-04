//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        var text=""
        if(typeof (this.props.data.message) === 'string'){
            try{
                this.props.data.message=JSON.parse(this.props.data.message)
            }catch (e){}
        }
        var data=this.props.data.message
        switch (data.type){
            case 'article':
                console.log(data.circle)
                if(data.circle==glitter.share.defineCode.activity){
                    text=` 發布了一則行事曆:<br>【${(data.title)}】`
                }else{
                    text=` 發布了一則貼文:<br>【${(data.title)}】`
                }
                break
            case 'advice':
                text=`發布了一則推播:<br>【${(data.title)}】`
                if(text.length>50){
                    text=text.substring(0,150)+"...點擊查看更多"
                }
                break
        }
        return <div className="itemMessage" id={`itemMessage`+this.props.index} onMouseDown={
            function (e){
                switch (data.type){
                    case 'article':
                        glitter.share.dataLoading(true)
                        glitter.publicBeans.publicLogic.getArticle({
                            defineId:that.props.data.aid,
                            index:'-1'
                        },function (response){
                            glitter.share.dataLoading(false)
                            if(response===undefined){
                                glitter.share.internetError()
                            }else{
                                if(response.result){
                                    if(response.data.length>0){
                                        if(response.data[0].circle===`${glitter.share.defineCode.activity}`){
                                            glitter.changePage('publicResource/page/Page_Show_Activity.html','Page_Show_Activity',true,response.data[0])
                                        }else{
                                            glitter.changePage('publicResource/page/Page_IG_ShowArticle.html', 'Page_IG_ShowArticle', true, {
                                                defineId: data.id,
                                                index: '-1'
                                            })
                                        }
                                    }else{
                                        glitter.share.hint("貼文已刪除!")
                                    }
                                }
                            }
                        })
                        break
                    case 'advice':
                        glitter.openDiaLog('publicResource/dialog/Dia_Show_Advice.html','Dia_Show_Advice',false,false,data,function (){})
                        break
                }

            }
        }>
            <div className="flexUser">
                <img src={this.props.data.head} className="img"></img>
                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.pick)}`}</span>
                    <h4 className={`textPLace ${(this.props.data.reader==="0") ? "black":""}`} dangerouslySetInnerHTML={{__html:text}}>
                    </h4>
                    <span className="time">{`${(this.props.data.time.replace(".0",""))}`}</span>
                </div>
            </div>
        </div>
    },
    componentDidMount:function (){
        let index=this.props.index
        let height=$(`#itemMessage${(index)}`).height()
        if(height!==undefined){
            publicShare.changeItemHeight(index,height)
        }
    },
    preventClick:false
});
var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    componentDidMount:function (){
        PullToRefresh.init({
            mainElement: '#AdviceContent',
            onRefresh: function(cb) {
                reloadData()
                cb()
            },
            shouldPullToRefresh:function (){
                return $('#AdviceContent div').get(0).scrollTop<=0
            }
        });
    },
    getInitialState: function() {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data:[]
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
        if(this.state.isInfiniteLoading||this.isBtn){return}
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        function loadData(){
            glitter.publicBeans.publicLogic.getAdviceList({
                index:that.index,
                toAccount:glitter.share.manager
            },function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({})
                        }else{
                            that.isBtn=true
                            that.index=response.data[response.data.length-1].id
                            that.setState({
                                isInfiniteLoading: false,
                                elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(response.data.length,50)),
                                data:that.state.data.concat(response.data)
                            });
                        }
                    }else{
                        loadData()
                    }
                }
            })
        }
        loadData()
    },
    elementInfiniteLoad: function() {
        if(this.isBtn){return ``}
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function() {
        let that=this
        publicShare.changeItemHeight=function (index,height){
            if(that.state.elementHeights[index]===height){return}
            that.state.elementHeights[index]=height
            that.setState({});
        }
        filterText=function (){
            that.setState({});
        }
        reloadData=function (code){
            that.index="-1"
            that.isBtn=false
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data:[],
                isBtn:false
            })
            that.handleInfiniteLoad()
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        if(elements.length===0 && that.state.isBtn){
            return <div dangerouslySetInnerHTML={{__html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無通知...</h3>`}}></div>
        }else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={$('#AdviceContent').height()}
                infiniteLoadBeginEdgeOffset={200}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={100}

            >
                {elements}
            </Infinite>;
        }

    },
    //是否滾到底部
    isBtn:false,
    index:'-1'
});
var searchText=''
var reloadData=function (code){}
var filterText=function (){}
let timer=setInterval(function (){
    if(document.getElementById('AdviceContent')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('AdviceContent'));
        clearInterval(timer)
    }
},100)




