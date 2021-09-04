//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        var subtitle=''
        switch (""+this.props.data.singlePermisson){
            case '0':
                subtitle="個人會員"
                break
            case '1':
                subtitle="終身會員"
                break
            case '2':
                subtitle="自然會員"
                break
            case '3':
                subtitle="團體會員"
                break
            case '4':
                subtitle="非會員"
                break
        }
        console.log(gBundle.showSubTitle)
        if(((this.props.data.pick).indexOf(searchText)===-1)){return  ``}
        return <div className="itemMessage" id={`itemMessage`+this.props.index} onMouseDown={function (e){
            if(gBundle.userSelect!==undefined){
                gBundle.userSelect(that.props.data)
            }else{
                userSelectCallback(that.props.data)
            }
        }
        }>
            <div className="flexUser">
                <img src={this.props.data.head} className="img"></img>
                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.pick)}`}</span>
                     <div className={"space"}></div>
                    {(gBundle.showSubTitle) ?  <span className="subTitle">{subtitle}</span>:``}

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
            gBundle.data.index=that.index
            gBundle.data.filterText=searchText
            gBundle.excute(gBundle.data,function (response){
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
        infinilateView=that
        publicShare.changeItemHeight=function (index,height){
            if(that.state.elementHeights[index]===height){return}
            that.state.elementHeights[index]=height
            that.setState({});
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        if (elements.length === 0 && that.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<div style="width: 50vw;height:50vh;display: flex;flex-direction: column;align-items: center;justify-content:center;width: 100%;">
<img src="../img/classmate.png" style="width: 70px;min-height: 70px;">
                <h3 style="margin-top:0;color: grey;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">查無搜尋結果...</h3>
</div>`
            }}></div>
        } else {
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={viewHeight}
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
let searchText=''
var viewHeight=0
var infinilateView=undefined
var timer=setInterval(function (){
    if(document.getElementById('UserSelect')){
        viewHeight=$('#UserSelect').height()
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('UserSelect'));
        setInterval(function (){
            if(searchText!==$('#serch').val()){
                searchText=$('#serch').val()
                infinilateView.setState({
                    isInfiniteLoading: false,
                    elementHeights: [],
                    data:[]
                });
                infinilateView.isBtn=false
                infinilateView.index='-1'
                infinilateView.handleInfiniteLoad()
            }
        },1000)
        clearInterval(timer)
    }
},100)

//選擇回條
var userSelectCallback=function (data){
    glitter.changePage('publicResource/page/Page_User_Info.html', 'Page_User_Info', true, data.account)
}



