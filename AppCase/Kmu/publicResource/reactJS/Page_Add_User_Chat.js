//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        if(((this.props.data.pick).indexOf(searchText)===-1) || (that.props.data.account===glitter.publicBeans.publicLogic.customDefine.account)){return  ``}
        return <div className="itemMessage" id={`itemMessage`+this.props.index} onMouseDown={function (e){
            userSelectCallback(that.props.data)
        }
        }>
            <div className="flexUser">
                <img src={this.props.data.head} className="img"></img>
                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.pick)}`}</span>
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
            if(toggleType===0){
                glitter.publicBeans.publicLogic.getMyFriend({
                    index:that.index
                },function (response){
                    decodeResponse(response)
                })
            }else{
                glitter.publicBeans.publicLogic.searchUser({
                    index:that.index,
                    filterText:(searchText),
                    equal:!(glitter.publicBeans.publicLogic.customDefine.isManager())
                },function (response){
                    decodeResponse(response)
                })
            }
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
            if(toggleType===0){
                that.setState({});
            }else{
                that.isBtn=false
                that.index='-1'
                that.setState({
                    elementHeights: [],
                    isInfiniteLoading: false,
                    data:[]
                })
                that.handleInfiniteLoad()
            }
        }
        changeToggle=function (){
            that.isBtn=false
            that.index='-1'
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data:[]
            })
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        if (elements.length === 0 && that.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<div style="width: 50vw;height:50vh;display: flex;flex-direction: column;align-items: center;justify-content:center;width: 100%;">
<img src="../img/classmate.png" style="width: 70px;min-height: 70px;">
                <h3 style="margin-top:0;color: grey;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">查無用戶...</h3>
</div>`
            }}></div>
        } else {
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={$('#UserSelect').height()}
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
let filterText=function (){}
//0為好友,1為所有用戶
let toggleType=0
let changeToggle=undefined
function renderType(type){
    if(!changeToggle){
        toggleType=type
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('UserSelect'));
    }else{
        if(toggleType!==type){
            toggleType=type
            changeToggle()
        }
    }
}

//選擇回條
var userSelectCallback=function (data){}



