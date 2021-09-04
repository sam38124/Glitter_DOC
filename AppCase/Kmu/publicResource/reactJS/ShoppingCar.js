//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        let data=this.props.data
        if(typeof(data.titleImage)==='string'){
            data.titleImage=JSON.parse(data.titleImage)
            data.image=data.titleImage
        }
        return <div className="itemMessage" id={`itemMessage`+this.props.index} >
            <div className="flexItem">
                <img className="checkBox" src={`../../img/checkbox_check.png`}></img>
                <img className="shopImg" src={`${data.titleImage[0]}`}></img>
                <div className="flexCenter">
                    <span className="title">{`${(data.title)}`}</span>
                    <span className="money">{`\$${(data.price)}`}</span>
                    <div className={"countPlace"}>
                        <h3 className={"count"} onMouseDown={function (e){
                            if((parseInt(data.count,10)<2)){return}
                            data.count=(parseInt(data.count,10)-1)
                            that.setState({})
                            resetSumPrice()
                        }}>-</h3>
                        <h3 className={"number"} >{`${data.count}`}</h3>
                        <h3 className={"count"} onMouseDown={function (e){
                            data.count=(parseInt(data.count,10)+1)
                            that.setState({})
                            resetSumPrice()
                        }
                        }>+</h3>
                    </div>
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
            glitter.publicBeans.publicLogic.getShoppingList({
                index:that.index
            },function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({})
                        }else{
                            that.isBtn=true
                            that.index=response.data[response.data.length-1].id
                            var price=0
                            response.data.map(function (data){
                                price+=(parseInt(data.price,10))
                            })
                            sum.sumPrice=price
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
            })
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
        getData=function (){
            return that.state.data
        }
        filterText=function (){
            that.setState({});
        }

        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={$('#Content').height()}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.handleInfiniteLoad}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            timeScrollStateLastsForAfterUserScrolls={1000}

        >
            {elements}
        </Infinite>;
    },
    //是否滾到底部
    isBtn:false,
    index:'-1'
});
var getData=function (){}
function resetSumPrice(){
    var price=0
    getData().map(function (data){
        price+=(parseInt(data.count,10)*parseInt(data.price,10))
    })
    sum.sumPrice=price
}
var searchText=''
var filterText=function (){}
let timer=setInterval(function (){
    if(document.getElementById('Content')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('Content'));
        clearInterval(timer)
    }
},100)





