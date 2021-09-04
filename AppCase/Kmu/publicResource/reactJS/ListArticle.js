var ListItem = createReactClass({
    getDefaultProps: function () {
    },
    render: function () {
        if (this.props.data === undefined) {
            return ``
        }
        let that = this
        function getHtml(data) {
            if (data === undefined) {
                return ``
            }
            try {
                if (data.circle === "5") {
                    if (typeof (data.titleImage) === 'string') {
                        data.titleImage = JSON.parse(data.titleImage)
                        data.image = data.titleImage
                    }
                } else {
                    if (typeof (data.image) === 'string') {
                        data.image = JSON.parse(data.image)
                    }
                }
            } catch (e) {
            }
            if ((data.image === undefined) || data.image.length === 0) {data.image = ["../img/noimage.png"]}
            return <div className={"gridItem"} onMouseDown={function (e) {
                if (that.preventClick) {
                    return
                }
                if (data.circle === '5') {
                    glitter.publicBeans.publicLogic.showCommidity(data)
                } else {
                    glitter.publicBeans.publicLogic.showArticle(data)
                }
            }}>
                <div className="item">
                    <div className="itemImg"><img src={`${data.image[0]}`}></img>
                    </div>
                    <div className="titleList">
                        <div className={'itemTitlePlace'}><span
                            className="itemTitle">{(data.title)}</span></div>

                        <div className={"userBar"}>
                            <img src={`${data.head}`}></img>
                            <span>{`${(data.pick)}`}</span>
                        </div>
                        <div className={"bottomBar"}>
                            <div className={'loveBar'} onMouseDown={
                                function (e) {
                                    that.preventClick = true
                                    setTimeout(function () {
                                        that.preventClick = false
                                    }, 1000)
                                    glitter.openDiaLog('dialog/Dia_DataLoading.html', 'postLike', false, false, '{}')
                                    glitter.publicBeans.publicLogic.postLike({
                                        id: data.id,
                                        type: 'Article'
                                    }, function (response) {
                                        glitter.closeDiaLogWithTag('postLike')
                                        if (response === undefined) {
                                            glitter.openDiaLog('dialog/Dia_DisConnect.html', 'DisConnect', false, false, function () {
                                            })
                                        } else {
                                            data.myLove = !data.myLove
                                            data.love = (data.myLove) ? `${parseInt(data.love, 10) + 1}` : `${parseInt(data.love, 10) - 1}`
                                            that.setState({})
                                        }
                                    })
                                }
                            }>
                                <img src={(data.myLove) ? '../img/heart2.png' : '../img/heart.png'}></img>
                                <span>{data.love}</span>
                            </div>

                            <div className={'loveBar'}>
                                <img src={'../img/replyicon.png'}></img>
                                <span>{data.replyCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        return <div id={`list-item${this.props.index}`}>
            {(that.props.index === 0 && this.props.adData.length > 0) ? <div>
                <div className="flexslider">
                    <ul className="slides" id="imageList"></ul>
                    <div id="imageIndex">1/1</div>
                </div>
                <div className={"SubItem"}>
                    <div onClick={function (e) {
                        glitter.openNewTab('https://www.cdc.gov.tw/')
                    }
                    } dangerouslySetInnerHTML={{
                        __html: `
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/ROC_Centers_for_Disease_Control_Emblem.svg/1200px-ROC_Centers_for_Disease_Control_Emblem.svg.png" style="width: 50px;height: 50px;border-radius: 50%;background-color: whitesmoke;">
                    <h3>疾管署</h3>
                    `
                    }}></div>
                    <div onClick={function (e) {
                        glitter.openNewTab('https://www.mohw.gov.tw/mp-1.html')
                    }
                    } dangerouslySetInnerHTML={{
                        __html: `
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/ROC_Ministry_of_Health_and_Welfare_Seal.svg/1200px-ROC_Ministry_of_Health_and_Welfare_Seal.svg.png" style="width: 50px;height: 50px;border-radius: 50%;background-color: whitesmoke;">
                    <h3>衛生福利部</h3>
                    `
                    }}></div>
                    <div onClick={function (e) {
                        glitter.openNewTab('https://www.cwb.gov.tw/V8/C/W/OBS_Map.html')
                    }
                    } dangerouslySetInnerHTML={{
                        __html: `
                    <img src="https://www.cwb.gov.tw/V8/assets/img/cwb-logoBlue.svg" style="width: 50px;height: 50px;border-radius: 50%;background-color: dodgerblue;">
                    <h3>氣象局</h3>
                    `
                    }}></div>
                    <div onClick={function (e) {
                        glitter.openNewTab('https://www.fda.gov.tw/TC/index.aspx')
                    }
                    } dangerouslySetInnerHTML={{
                        __html: `
                    <img src="data:image/png;base64,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" style="width: 50px;height: 50px;border-radius: 50%;background-color: whitesmoke;">
                    <h3>食藥署</h3>
                    `
                    }}></div>
                    <div onClick={function (e) {
                        glitter.openNewTab('https://www.nhi.gov.tw/News.aspx?n=90F6EDBE1330721A&sms=36E92BA4F9F6D42B')
                    }
                    } dangerouslySetInnerHTML={{
                        __html: `
                    <img src="https://storage.googleapis.com/squarestudio/img/1622065934345.png" style="width: 50px;height: 50px;border-radius: 50%;background-color: whitesmoke;">
                    <h3>闢謠專區</h3>
                    `
                    }}></div>
                </div>
            </div> : ''}
            <div className="infinite-list-item">
                {getHtml(that.props.data)}
                {getHtml(that.props.data2)}
            </div>
        </div>

    },
    preventClick: false,
    componentDidMount: function () {
        if (this.props.index === 0) {
            var that = this
            $('#imageIndex').html(`${1}/${this.props.adData.length}`)
            this.props.adData.map(function (data, position) {
                if (position > 10) {
                    return
                }
                if (data.circle === "5") {
                    if (typeof (data.titleImage) === 'string') {
                        data.titleImage = JSON.parse(data.titleImage)
                        data.image = data.titleImage
                    }
                } else {
                    if (typeof (data.image) === 'string') {
                        data.image = JSON.parse(data.image)
                    }
                }
                if (data.image.length > 0) {
                    $('#imageList').append(`
<li id="imageIndex${position}"><img src="${data.image[0]}" />
<h3 class="imageTitle">${(data.title)}</h3>
</li>`)
                    $(`#imageIndex${position}`).click(function () {
                        glitter.publicBeans.publicLogic.showArticle(data)
                    })
                }
            })
            $(".flexslider").flexslider({
                controlNav: false, slideshowSpeed: 3000,
                directionNav: false, after: function (slider) {
                    $('#imageIndex').html(`${slider.currentSlide + 1}/${that.props.adData.length}`)
                }
            });
        }
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
var VariableInfiniteList = createReactClass({
    componentDidMount:function (){
        PullToRefresh.init({
            mainElement: '#infinite-example-two',
            onRefresh: function(cb) {
             reloadData()
                cb()
            }
        });
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
                        elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length / 2, 10)),
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
                    if(item.length>5){
                        item.length=5
                    }
                    getArticle()
                    that.setState({
                        adData: item
                    });
                }
            })
        }

        if (that.state.adData.length === 0) {
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
        reloadData = function () {
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data: [],
                isBtn: false
            })
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight = function (index, height) {
            if (height <= that.state.elementHeights[index]) {
                return
            }
            console.log(`changeHeight-index:${index}-height:${height}-elementHeights:${that.state.elementHeights[index]}`)
            that.state.elementHeights[index] = height
            that.setState({});
        }
        let elements = this.state.elementHeights.map(function (el, i) {
            if (i === 0) {
                return <ListItem adData={that.state.adData} key={i} index={i} height={el} lineHeight={el + "px"}
                                 data={that.state.data[i * 2]} data2={that.state.data[i * 2 + 1]}/>;
            } else {
                return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i * 2]}
                                 data2={that.state.data[i * 2 + 1]}/>;
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
                infiniteLoadBeginEdgeOffset={1000}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={1000}
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
    isInitial:false,
    requestData: {},
    startRequest: function (data) {
        listArticleView.requestData=data
        if(listArticleView.isInitial){
            reloadData()
        }else{
            listArticleView.isInitial=true
            ReactDOM.render(<VariableInfiniteList/>, document.getElementById('infinite-example-two'));
        }
    }
}




