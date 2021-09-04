var ListItem = createReactClass({
    getDefaultProps: function() {},
    render: function() {
        if(this.props.data===undefined){
            return  ``
        }
        var that=this
        function getHtml(data){
            if(data===undefined){return  ``}
            if(typeof(data.titleImage)==='string'){
                data.titleImage=JSON.parse(data.titleImage)
            }
            return <div className={"gridItem"}  onMouseDown={function (e) {
                if(that.preventClick){
                    return
                }
                glitter.publicBeans.publicLogic.showCommidity(data)
            }}>
                <div className="item">
                    <div className="itemImg"><img src={`${data.titleImage[0]}`}></img>
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
                                    that.preventClick=true
                                    setTimeout(function (){that.preventClick=false},1000)
                                    glitter.openDiaLog('dialog/Dia_DataLoading.html', 'postLike', false, false, '{}')
                                    glitter.publicBeans.publicLogic.postLike({
                                        id: data.id,
                                        type: 'shop'
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
                                <img  src={(data.myLove) ? '../img/heart2.png' : '../img/heart.png'}></img>
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
        return <div>
            {(that.props.index===0 && this.props.adData.length>0) ? <div>
                <div className="flexslider">
                    <ul className="slides" id="imageList"></ul>
                    <div id="imageIndex">1/1</div>
                </div>
                <h3 className={"titleHint"}>最新貼文</h3>
            </div>:''}
            <div className="infinite-list-item" id={`list-item${this.props.index}`}>
                {getHtml(that.props.data)}
                {getHtml(that.props.data2)}
            </div>
        </div>

    },
    preventClick:false,
    componentDidMount:function (){
        if($(`#list-item${this.props.index}`).get(0)){
            let height=$(`#list-item${this.props.index}`).height()
            if(height!==undefined){
                publicShare.changeItemHeight(0,height)
            }
        }
        if(this.props.index===0){
            var that=this
            $('#imageIndex').html(`${1}/${this.props.adData.length}`)
            this.props.adData.map(function (data,position){
                if(position>10){return}
                if(typeof(data.image)==='string'){
                    data.image=JSON.parse(data.image)
                }
              if(data.image.length>0)  {
                  $('#imageList').append(`
<li id="imageIndex${position}"><img src="${data.image[0]}" />
<h3 class="imageTitle">${(data.title)}</h3>
</li>`)
                  $(`#imageIndex${position}`).click(function (){
                      glitter.publicBeans.publicLogic.showArticle(data)
                  })
              }
            })
            $(".flexslider").flexslider({
                controlNav: false,slideshowSpeed: 3000,
                directionNav: false, after: function (slider) {
                    $('#imageIndex').html(`${slider.currentSlide + 1}/${that.props.adData.length}`)
                }
            });
        }
    }
});
var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    getInitialState: function() {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data:[],
            adData:[],
            isBtn:false
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
        //取得商店內容
        function getArticle(){
            glitter.publicBeans.publicLogic.getArticle({
                index:(that.state.data.length===0) ? "-1":(that.state.data[that.state.data.length-1].id),
                code:5
            },function (response){
                if(response===undefined){
                    that.setState({
                        isInfiniteLoading: false
                    });
                    that.handleInfiniteLoad()
                }else{
                    let item = response["data"]
                    if(item.length===0){that.state.isBtn=true}
                    that.setState({
                        isInfiniteLoading: false,
                        elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length/2,10)),
                        data:that.state.data.concat(item)
                    });
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
        reloadData=function (){
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data:[],
                isBtn:false
            })
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight=function (index,height){
            if(height<=that.state.elementHeights[index]){return}
            console.log(`changeHeight-index:${index}-height:${height}-elementHeights:${that.state.elementHeights[index]}`)
            that.state.elementHeights[index]=height
            that.setState({});
        }
        let elements = this.state.elementHeights.map(function(el, i) {
            if(i===0){
                return <ListItem adData={that.state.adData} key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i*2]} data2={that.state.data[i*2+1]}/>;
            }else {
                return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i*2]} data2={that.state.data[i*2+1]}/>;
            }
        })
        if(elements.length===0 && that.state.isBtn){
            return <div dangerouslySetInnerHTML={{__html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無內容...</h3>`}}></div>
        }else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={$('#CommidityView').height()}
                infiniteLoadBeginEdgeOffset={200}
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

var reloadData=function (){}

ReactDOM.render(<VariableInfiniteList/>,document.getElementById('CommidityView'));


