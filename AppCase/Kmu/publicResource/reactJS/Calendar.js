//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        var data=this.props.data
        try {
            if(typeof(this.props.data.image)==='string'){
                this.props.data.image=JSON.parse(this.props.data.image)
            }
        }catch (e) {
            data.image = undefined
        }
        return <div className="itemMessage" id={`itemMessage`+this.props.index} onClick={
            function (e){
                if(that.preventClick){return}
                glitter.changePage('publicResource/page/Page_Show_Activity.html','Page_Show_Activity',true,that.props.data)
            }
        }>
            <div className="flexUser">
                <div className={`leftFlex`}>
                    <img src={this.props.data.head} className="img"></img>
                </div>

                <div className="flexCenter">
                    <span className="textPLace black bigText">{`${(this.props.data.title)}`}</span>
                    <span className="textPLace black">{`${(this.props.data.startTime).replace(".0","").substring(0,10)}`}</span>
                    <span className="textPLace black">{`${(this.props.data.endTime).replace(".0","").substring(0,10)}`}</span>
                    {(this.props.data.address!==undefined) ? <div className={`flex`}>
                        <div className={`center`} dangerouslySetInnerHTML={{__html: `<img src="../img/location.png" class="imgSerch" onclick="codeAddress()">`}}></div>
                        <h4 className={`textPLace`}>
                            {`${(this.props.data.address)}`}
                        </h4>
                    </div>:``}

                </div>
                <div className={`rightFlex`}>
                    <span className={"edit"} onClick={
                        function (r){
                            that.preventClick=true
                            setTimeout(function (){that.preventClick=false},100)
                            glitter.openBottomSheet('publicResource/dialog/Dia_Select_Act_Option.html',"Dia_Select_Act_Option",data,"100px",true,true)
                        }
                    }>選項</span>
                    {(data.image===undefined||data.image.length===0)? ``: <img src={`${data.image}`} className={`hintImg`}></img>}
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
var filterTime={}
var VariableInfiniteList = createReactClass({
    componentDidMount:function (){
        PullToRefresh.init({
            mainElement: '#Calendar',
            onRefresh: function(cb) {
                reloadData()
                cb()
            },
            shouldPullToRefresh:function (){
                return $('#Calendar div').get(0).scrollTop<=0
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
        if(this.state.isInfiniteLoading||this.isBtn||!canLoading){return}
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        var map={
            startTimeIndex:that.index,
            code:gBundle.code,
            startTime:filterTime.startTime,
            endTime: filterTime.endTime,
            startTimeFilter:filterTime.startTimeFilter,
            orderString:'order by startTime asc limit 0,50',
            inCode:gBundle.inCode
        }
        if(gBundle.request!==undefined){
            var key = Object.keys(gBundle.request);
            for (var a = 0; a < key.length; a++) {
                map[key[a]]=gBundle.request[key[a]]
            }
        }
        function loadData(){
            glitter.publicBeans.publicLogic.getArticle(map,function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({})
                        }else{
                            that.index=response.data[response.data.length-1].startTime
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
            that.index=undefined
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
        if (elements.length === 0 && that.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無任何內容...</h3>`
            }}></div>
        } else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={$('#Calendar').height()}
                infiniteLoadBeginEdgeOffset={1000}
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
    index:undefined
});
var searchText=''
var reloadData=function (code){}
var filterText=function (){}
var canLoading=false
let timer=setInterval(function (){
    if(document.getElementById('Calendar')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('Calendar'));
        clearInterval(timer)
    }
},100)




