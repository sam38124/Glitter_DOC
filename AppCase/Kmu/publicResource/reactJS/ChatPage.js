//留言列表
var clickTimer = undefined
var nextClick=true
var block=[]
var ListItem = createReactClass({
    render: function () {
        var that = this
        let jsonMessage = undefined
        if(block.indexOf(that.props.data.id)!==-1){
            return ``
        }
        let longClick = function () {
            clickTimer = setTimeout(function () {
                nextClick = false
                var itemMap = [{
                    title: '刪除訊息', callback: function (){
                        glitter.share.dataLoading(true)
                        glitter.publicBeans.publicLogic.deleteMessageMemory({
                            id:that.props.data.id
                        },function (response){
                            glitter.share.dataLoading(false)
                            if(response===undefined){
                                glitter.share.internetError()
                            }else{
                                if(response){
                                    block.push(that.props.data.id)
                                    reView.setState({})
                                }
                            }
                        })
                    }
                }
                ]
                glitter.openBottomSheet('publicResource/dialog/Dia_Select_Option.html', 'Dia_Select_Option', itemMap, 10, true, true)
            }, 1000)
        }
        let stopClick = function () {
            clearInterval(clickTimer)
        }
        try {
            jsonMessage = JSON.parse((this.props.data.content))
            console.log(this.props.data.content)
        } catch (e) {
            jsonMessage = {message: ''}
        }

        if (((that.props.data.pick).indexOf(searchText) === -1) || (that.props.data.account === glitter.publicBeans.publicLogic.customDefine.account)) {
            return <div className="itemMessage" id={`itemMessage` + this.props.index}></div>
        }
        return <div className="itemMessage" id={`itemMessage` + this.props.index} onClick={
            function (e) {
                if(!nextClick){
                    nextClick=true
                    return}
                glitter.changePage('publicResource/page/Page_Show_User_Message_0.html', 'Page_Show_User_Message_0', true, that.props.data)
            }
        } onPointerDown={function (e) {
            longClick()
        }}
                    onPointerUp={function (e) {
                        stopClick()
                    }} onPointerOut={function (e) {
            stopClick()
        }}>
            {(that.props.data.display === "group") ? <span className={"colorImport"}>群組</span> :
                <span className={"minTitle"}>好友</span>}
            <div className="flexUser">
                <img src={this.props.data.head} className="img"></img>
                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.pick)}`}</span>
                    <h4 className={`textPLace ${(this.props.data.reader === "0") ? "black" : ""}`}>
                        {`${(jsonMessage.img !== undefined) ? `傳送了${jsonMessage.img.length}張圖片` : ((jsonMessage.video !== undefined) ? `傳送了1則影片` : (jsonMessage.message))}`}
                    </h4>
                    <span className="time">{`${(this.props.data.time)}`}</span>
                </div>
            </div>
        </div>
    },
    componentDidMount: function () {
        let index = this.props.index
        let height = $(`#itemMessage${(index)}`).height()
        if (height !== undefined) {
            publicShare.changeItemHeight(index, height)
        }
    },
    preventClick: false
});
var publicShare = {
    changeItemHeight: function () {
    }
}
var VariableInfiniteList = createReactClass({
    getInitialState: function () {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data: []
        };
    },
    generateVariableElementHeights: function (number, height) {
        var heights = [];
        for (var i = 0; i < number; i++) {
            heights.push(height);
        }
        return heights;
    },
    handleInfiniteLoad: function () {
        if (this.state.isInfiniteLoading || this.isBtn) {
            return
        }
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });

        function loadData() {
            glitter.publicBeans.publicLogic.getUserTitleMessage({
                index: that.index,
            }, function (response) {
                if (response === undefined) {
                    loadData()
                } else {
                    if (response.result) {
                        if (response.data.length === 0) {
                            that.isBtn = true
                            that.setState({})
                        } else {
                            let indexFilter = response.data.filter(function (data) {
                                return data.display === "user"
                            })
                            if (indexFilter.length > 0) {
                                that.index = indexFilter[indexFilter.length - 1].id
                            } else {
                                that.isBtn = true
                                that.setState({})
                            }
                            that.setState({
                                isInfiniteLoading: false,
                                elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(response.data.length, 50)),
                                data: that.state.data.concat(response.data)
                            });
                            response.data.map(function (item) {
                                console.log(item.link)
                                glitter.publicBeans.publicLogic.subScribeTopic(item.link)
                            })
                        }
                    } else {
                        loadData()
                    }
                }
            })
        }

        loadData()
    },
    elementInfiniteLoad: function () {
        if (this.isBtn) {
            return ``
        }
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function () {
        let that = this
        reView=that
        publicShare.changeItemHeight = function (index, height) {
            if (that.state.elementHeights[index] === height) {
                return
            }
            that.state.elementHeights[index] = height
            that.setState({});
        }
        filterText = function () {
            that.setState({});
        }

        var elements = this.state.elementHeights.map(function (el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"}
                             data={that.state.data[i]}/>;
        })
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={$('#ChatView').height()}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.handleInfiniteLoad}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            timeScrollStateLastsForAfterUserScrolls={100}

        >
            {elements}
        </Infinite>;
    },
    //是否滾到底部
    isBtn: false,
    index: '-1'
});
var searchText = ''
var filterText = function () {
}
var reView=undefined
let timer = setInterval(function () {
    if (document.getElementById('ChatView')) {
        ReactDOM.render(<VariableInfiniteList/>, document.getElementById('ChatView'));
        clearInterval(timer)
    }
}, 100)




