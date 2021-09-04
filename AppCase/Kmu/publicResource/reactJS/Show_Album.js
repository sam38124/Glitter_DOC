var ListItem = createReactClass({
    getDefaultProps: function() {},
    render: function() {
        var that=this
        var data=this.props.data
        var element=[]
        this.props.data.map(function (data){
            element.push(<div className={"imagePlace"} onClick={function (e){
                glitter.changePage('publicResource/page/Page_Show_Image.html','Page_Show_Image',true, [data].concat(
                    JSON.parse(gBundle.image).filter(function (data3){return data3!==data})
                ))
            }}>{(data.indexOf('HLS_ROUT')!==-1)? <div dangerouslySetInnerHTML={{__html:`
                            <video id="hls-video" autoplay loop muted playsinline style="width:  100%; height:100%;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
      poster="${data}/thumb.jpg">
    <source src="${data}/root.m3u8" type="application/x-mpegURL" id="source">
</video>
                            `}}></div>:<img src={data}></img>}</div>)
            // element.push( <div className={"imagePlace"}><img src={data}  onClick={function (e){
            //     glitter.changePage('publicResource/page/Page_Show_Image.html','Page_Show_Image',true, [data].concat(
            //         JSON.parse(gBundle.image).filter(function (data3){return data3!==data})
            //     ))
            // }}></img></div>)
        })
            return <div className="infinite-list-item" id={`list-item${this.props.index}`}
            >{(that.props.index===0) ? (<div className={"margin"}><h3 className="title">{gBundle.title}</h3><div className="countHint">{image.length} photos {gBundle.time}</div></div>) : ``}
                {
                    <div>
                        <div className={"gridItem"}>
                            {element}
                        </div>
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
        that.state.isBtn=true
        var image=JSON.parse(gBundle.image)
        that.setState({
            isInfiniteLoading: false,
            elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(image.length,10)),
            data:that.state.data.concat(image)
        });
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
            let dataIs=[]
            for(var a=0;a<2;a++){
                if(that.state.data[i*2+a]!==undefined){dataIs.push(that.state.data[i*2+a])}
            }
            return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={dataIs}/>;
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



