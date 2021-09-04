//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        let data=that.props
        if(((that.props.data.pick).indexOf(searchText) === -1)|| (that.props.data.account===glitter.publicBeans.publicLogic.customDefine.account)){
            return <div className="itemMessage" id={`itemMessage`+this.props.index} >   {((data.index===0)? <span className={"minTitle"}>我的好友</span>:``)}</div>
        }

        return <div className="itemMessage" id={`itemMessage`+this.props.index} onMouseDown={
            function (e){

            }
        }>
            {((data.index===0)? <span className={"minTitle"}>我的好友</span>:``)}
            <div className="flexUser" onMouseDown={
                function (e){
                    data.data.isSelect=!data.data.isSelect
                    that.setState({})
                }
            }>
                <img src={this.props.data.head} className="img"></img>
                <span className="pick">{`${(this.props.data.pick)}`}</span>
                <div className={"selectBox"} >
                    {(data.data.isSelect) ? <img className={"checkMark"} src="../img/check_mark_red.png"></img>:``}
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
            glitter.publicBeans.publicLogic.getMyFriend({
                index:that.index
            },function (response){
                decodeResponse(response)
            })
        }
        function decodeResponse(response){
            if(response===undefined){
                loadData()
            }else{
                if(response.result){
                    if(response.data.length===0){
                        that.isBtn=true
                        that.setState({})
                    }else{
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
        getData=function (){
            return that.state.data
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        if (elements.length === 0 && that.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<div style="width: 50vw;height:50vh;display: flex;flex-direction: column;align-items: center;justify-content:center;width: 100%;">
<img src="../img/classmate.png" style="width: 70px;min-height: 70px;">
                <h3 style="margin-top:0;color: grey;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚未添加好友...</h3>
</div>`
            }}></div>
        } else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={$('#AddUserView').height()}
                infiniteLoadBeginEdgeOffset={200}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={100}

            >
                {elements}
            </Infinite>;}

    },
    //是否滾到底部
    isBtn:false,
    index:'-1'
});
var getData=function (){}
var searchText=''
var filterText=function (){}
let timer=setInterval(function (){
    if(document.getElementById('AddUserView')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('AddUserView'));
        clearInterval(timer)
    }
},100)




