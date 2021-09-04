var ListItem = createReactClass({
    getDefaultProps: function() {},
    render: function() {
        if(this.props.data===undefined){
            return  ``
        }
        var that=this
        var element=[]
        this.props.data.map(function (data){
            try{
                if(data.circle==="5"){
                    if(typeof(data.titleImage)==='string'){
                        data.titleImage=JSON.parse(data.titleImage)
                        data.image=data.titleImage
                    }
                }else{
                    if(typeof(data.image)==='string'){
                        data.image=JSON.parse(data.image)
                    }
                }
            }catch (e){

            }
            if ((data.image === undefined) || data.image.length === 0) {data.image = ["../img/noimage.png"]}
            element.push(<div className={"gridItem"}  onMouseDown={function (e) {
                if(that.preventClick){return}
                glitter.changePage('publicResource/page/Page_IG_ShowArticle.html', 'Page_IG_ShowArticle', true, {
                    toAccount: data.account,
                    firstArticle:data.id,
                    index: '-1',
                    notCode: ['10']
                })
            }}>
                <div className="itemImg"><img src={`${data.image[0]}`}></img></div>
            </div>)
        })
        if(that.props.index===0){
            return  <div id={`list-item${this.props.index}`} dangerouslySetInnerHTML={{__html:getTopView()}}></div>
        }else{
            return <div className="infinite-list-item" id={`list-item${this.props.index}`}>
                {element}
            </div>
        }
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
            elementHeights: [0],
            isInfiniteLoading: false,
            data:[{id:"-1"},{id:"-1"},{id:"-1"}],
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
                elementHeights: [50],
                isInfiniteLoading: false,
                data:[{id:"-1"},{id:"-1"},{id:"-1"}],
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
            for(var a=0;a<3;a++){
                if(that.state.data[i*3+a]!==undefined){dataIs.push(that.state.data[i*3+a])}
            }
            return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={dataIs}/>;
        })
        if(that.state.elementHeights.length===1 && that.state.isBtn){
            return <div dangerouslySetInnerHTML={{__html: `${getTopView()}<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
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
        if(document.getElementById('infinite-example-two')){
            height=$('#infinite-example-two').height()
            ReactDOM.render(<VariableInfiniteList/>,document.getElementById('infinite-example-two'));
            clearInterval(timer)
        }
    },100)
}




//個人檔案View
function getTopView(){
    return ``
}

