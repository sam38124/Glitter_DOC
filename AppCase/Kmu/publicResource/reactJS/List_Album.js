var ListItem = createReactClass({
    getDefaultProps: function() {},
    render: function() {
        if(this.props.data===undefined){
            return  ``
        }
        var that=this
        var data=this.props.data
        var image=JSON.parse(that.props.data.image)
            return <div className="infinite-list-item" id={`list-item${this.props.index}`}
            >
                {
                    <div>
                        <div className={"gridItem"} onClick={function (e){
                            glitter.changePage('publicResource/page/Page_Show_Album.html','Page_Show_Album',true,data)
                        }
                        }>
                            {(image[0]!==undefined) ?    <div className={"imagePlace"}>{(image[0].indexOf('HLS_ROUT')!==-1)? <div dangerouslySetInnerHTML={{__html:`
                            <video id="hls-video" autoplay loop muted playsinline style="width:  100%; height:100%;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
      poster="${image[0]}/thumb.jpg">
    <source src="${image[0]}/root.m3u8" type="application/x-mpegURL" id="source">
</video>
                            `}}></div>:<img src={image[0]}></img>}</div>:``}
                            {(image[1]!==undefined) ?    <div className={"imagePlace"}>{(image[1].indexOf('HLS_ROUT')!==-1)? <div dangerouslySetInnerHTML={{__html:`
                            <video id="hls-video" autoplay loop muted playsinline style="width:  100%; height:100%;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
      poster="${image[1]}/thumb.jpg">
    <source src="${image[1]}/root.m3u8" type="application/x-mpegURL" id="source">
</video>
                            `}}></div>:<img src={image[1]}></img>}</div>:``}
                            {(image[2]!==undefined) ?    <div className={"imagePlace"}>{(image[2].indexOf('HLS_ROUT')!==-1)? <div dangerouslySetInnerHTML={{__html:`
                            <video id="hls-video" autoplay loop muted playsinline style="width:  100%; height:100%;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
      poster="${image[2]}/thumb.jpg">
    <source src="${image[2]}/root.m3u8" type="application/x-mpegURL" id="source">
</video>
                            `}}></div>:<img src={image[2]}></img>}</div>:``}
                            {(image[3]!==undefined) ?    <div className={"imagePlace"}>{(image[3].indexOf('HLS_ROUT')!==-1)? <div dangerouslySetInnerHTML={{__html:`
                            <video id="hls-video" autoplay loop muted playsinline style="width:  100%; height:100%;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
      poster="${image[3]}/thumb.jpg">
    <source src="${image[3]}/root.m3u8" type="application/x-mpegURL" id="source">
</video>
                            `}}></div>:<img src={image[3]}></img>}</div>:``}
                        </div>
                        <div className={"flex"}>
                            <div className={"flexCenter"}>
                                <div className={"title"}>{data.title}</div>
                                <span className={"count"}>{image.length}</span>
                            </div>
                            {(glitter.publicBeans.publicLogic.customDefine.isManager()) ?   <h3 className={"more"} onClick={function (e){
                                glitter.openBottomSheet('publicResource/dialog/Dia_Select_Albumn_Option.html','Dia_Select_Albumn_Option',data,'100px',true,true)}
                            }>...</h3>:``}

                        </div>
                        <div className={"spi"}></div>
                    </div>
                }
            </div>
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
            elementHeights: [],
            isInfiniteLoading: false,
            data:[],
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
                code:glitter.share.defineCode.album,
                index:that.index
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
                        that.index=item[item.length-1].id
                        that.setState({
                            isInfiniteLoading: false,
                            elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length,10)),
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
                elementHeights: [],
                isInfiniteLoading: false,
                data:[],
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
            return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        if(that.state.elementHeights.length===0 && that.state.isBtn){
            return <div dangerouslySetInnerHTML={{__html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
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
        if(document.getElementById('innerView')){
            height=$('#innerView').height()
            ReactDOM.render(<VariableInfiniteList/>,document.getElementById('innerView'));
            clearInterval(timer)
        }
    },100)
}



