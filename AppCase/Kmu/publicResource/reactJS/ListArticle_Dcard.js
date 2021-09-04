var ListItem = createReactClass({
    getDefaultProps: function () {
    },
    render: function () {
        var that = this
        var data = that.props.data
        try {
            if (typeof (data.image) === 'string') {
                data.image = JSON.parse(data.image)
            }
        } catch (e) {

        }
        if(data.image===undefined){
            data.image=[]
        }

        return <div id={`list-item${this.props.index}`} className={'list-item'} onClick={
          function (e){
              if(that.preventClick){return}
              glitter.changePage('publicResource/page/Page_Show_Article_Type_1.html','Page_Show_Article_Type_1',true,data)
          }
        }>
            <div className={`flexCenter ${(data.image.length>0) ? 'centerMax':''}`}>
                {((glitter.publicBeans.publicLogic.customDefine.account===data.account)||(glitter.publicBeans.publicLogic.customDefine.isManager())) ?  <h3 className={'edit'} onClick={
                    function (e){
                        that.preventClick=true
                        setTimeout(function (){that.preventClick=false},100)
                        glitter.openBottomSheet('publicResource/dialog/Dia_Select_Art_Option.html', "Dia_Select_Art_Option", data, "100px", true, true)
                    }
                }>編輯</h3>:''}
                <div className={'itemUserFlex'}>
                    <img src={`${data.head}`} className={'head'}></img>
                    <span className={'pick'}>{data.pick}</span>
                    <span className={'count2'}>{data.time.substring(0,10)}</span>

                </div>
                <h3 className={'title'}>{data.title}</h3>
                <span className={'content'}>{glitter.removeTag(data.content)}</span>
                <div className={'itemUserFlex'}>
                    <div dangerouslySetInnerHTML={{__html:`   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill:${(data.myLove)?'hotpink;':'rgba(0, 0, 0, 0.2);'}" focusable="false" role="img" aria-hidden="true"
             class="ite" width="25" height="25">
            <path d="M16.5 4A5.49 5.49 0 0012 6.344 5.49 5.49 0 007.5 4 5.5 5.5 0 002 9.5C2 16 12 22 12 22s10-6 10-12.5A5.5 5.5 0 0016.5 4z"
                  fill-rule="evenodd"></path>
        </svg>`}}></div>
                    <span className={'count'}>{data.love}</span>
                    <div dangerouslySetInnerHTML={{__html:`<svg viewBox="0 0 25 25" className="ite" focusable="false" width="25" height="25" role="img"
                         aria-hidden="true"
                         style="fill: rgba(0, 0, 0, 0.2);margin-left: 0px;">
                        <path
                            d="M17 4H7a5 5 0 00-5 5v5a5 5 0 005 5h.5v2.44a.75.75 0 001.22.58L12.5 19H17a5 5 0 005-5V9a5 5 0 00-5-5z"></path>
                    </svg>`}}></div>
                    <span className={'count'}>{data.replyCount}</span>

                </div>
            </div>
            {(data.image.length>0) ? <img className={'hintImage'} src={data.image[0]}></img>:``}
        </div>
    },
    componentDidMount: function () {
        var that = this
        if ($(`#list-item${this.props.index}`).get(0)) {
            let height = $(`#list-item${this.props.index}`).height()
            if (height !== undefined) {
                publicShare.changeItemHeight(this.props.index, height)
            }
        }
    }
});
var publicShare = {
    changeItemHeight: function () {
    }
}
var toggleRefresh = false
var VariableInfiniteList = createReactClass({
    componentDidMount: function () {
        PullToRefresh.init({
            mainElement: '#infinite-example-two',
            onRefresh: function (cb) {
                reloadData()
                cb()
            },
            shouldPullToRefresh: function () {
                return $('#infinite-example-two div').get(0).scrollTop <= 0
            }
        });
    },
    componentWillUnmount() {
        // Don't forget to destroy all instances on unmout
        // or you will get some glitches.
        PullToRefresh.destroyAll();
    },
    getInitialState: function () {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data: [],
            adData: [],
            isBtn: false
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
        if (this.state.isInfiniteLoading || this.state.isBtn) {
            return
        }
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });

        //取得文章內容
        function getArticle() {
            listArticleView.requestData.index = (that.state.data.length === 0) ? "-1" : (that.state.data[that.state.data.length - 1].id)
            glitter.publicBeans.publicLogic.getArticle(listArticleView.requestData, function (response) {
                if (response === undefined) {
                    that.setState({
                        isInfiniteLoading: false
                    });
                    that.handleInfiniteLoad()
                } else {
                    let item = response["data"]
                    if (item.length === 0) {
                        that.state.isBtn = true
                    }
                    that.setState({
                        isInfiniteLoading: false,
                        elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length, 10)),
                        data: that.state.data.concat(item)
                    });
                }
            })
        }

        //取得標頭廣告文章
        function getAdArticle() {
            glitter.publicBeans.publicLogic.getArticle({
                index: "-1",
                code: glitter.publicBeans.publicLogic.customDefine.adArticle.code
            }, function (response) {
                if (response === undefined) {
                    getAdArticle()
                } else {
                    let item = response["data"]
                    if (item.length > 5) {
                        item.length = 5
                    }
                    getArticle()
                    that.setState({
                        adData: item
                    });
                }
            })
        }

        if (that.state.adData.length === 0 && listArticleView.requestData.notAccount === undefined) {
            getAdArticle()
        } else {
            getArticle()
        }
    },
    elementInfiniteLoad: function () {
        if (this.state.isBtn) {
            return ``
        }
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function () {
        var that = this
        listArticleView.theView=that
        reloadData = function () {
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data: [],
                adData: [],
                isBtn: false
            })
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight = function (index, height) {
            if (height <= that.state.elementHeights[index]) {
                return
            }
            that.state.elementHeights[index] = height
            that.setState({});
        }
        let elements = this.state.elementHeights.map(function (el, i) {
            if (i === 0) {
                return <ListItem adData={that.state.adData} key={i} index={i} height={el} lineHeight={el + "px"}
                                 data={that.state.data[i]}/>;
            } else {
                return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
            }
        })
        if (elements.length === 0 && that.state.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無內容...</h3>`
            }}></div>
        } else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={$('#infinite-example-two').height()}
                infiniteLoadBeginEdgeOffset={4000}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={100}
            >
                {elements}
            </Infinite>;
        }
    }
});

var reloadData = function () {
}
//文章加載View
var listArticleView = {
    theView:undefined,
    isInitial: false,
    requestData: {},
    startRequest: function (data) {
        listArticleView.requestData = data
        if (listArticleView.isInitial) {
            reloadData()
        } else {
            listArticleView.isInitial = true
            ReactDOM.render(<VariableInfiniteList/>, document.getElementById('infinite-example-two'));
        }
    }
}




