var lastDrag=undefined
//留言列表
var ListItem = createReactClass({
    render:function (){
        var that=this
        if(((this.props.data.title).indexOf(searchText)===-1)){return  ``}
        return <div className="itemMessage" id={`itemMessage`+this.props.index} onClick={function (e){
            if(that.preventClick){return}
            userSelectCallback(that.props.data)
        }
        }>
            <div className="flexUser" draggable="true"  onDrag={function (e){
                console.log((e.clientY-110)/50)
                lastDrag=(e.clientY-110)/50
            }
            }  onDragEnd={function (e){
                if(glitter.publicBeans.publicLogic.customDefine.isManager()){
                    if(Math.round(lastDrag)>(infiView.state.data.length-1)){
                        console.log("resetlastDrag")
                        lastDrag=infiView.state.data.length-1
                    }
                    var data1=infiView.state.data[that.props.index]
                    var data3=infiView.state.data[Math.round(lastDrag)]
                    var dd=infiView.state.data
                    dd[that.props.index]=data3
                    dd[Math.round(lastDrag)]=data1
                    infiView.setState({
                        data:dd
                    })
                    glitter.share.dataLoading(true)
                    var id=[]
                    dd.map(function (data){
                        id.push(data.id)
                    })
                    glitter.postRequest("Kmu", "setPro", {
                        data:{
                            name: 'setLinkPosition',
                            string: JSON.stringify(id)
                        }
                    }, function (response) {
                        glitter.share.dataLoading(false)
                        if (response === undefined) {
                            glitter.share.internetError()
                        } else {
                            if (response.result) {
                                glitter.share.hint("設定成功")
                            } else {
                                glitter.share.hint("設定失敗")
                            }
                        }
                    })
                }

            }
            }>
                <img src={this.props.data.head} className="img"></img>

                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.title)}`}</span>
                </div>
                {(glitter.publicBeans.publicLogic.customDefine.isManager()) ?    <span className="edit" onClick={function (e){
                    that.preventClick=true
                    setTimeout(function (){
                        that.preventClick=false
                        glitter.openBottomSheet('publicResource/dialog/Dia_Select_Link_Option.html', 'Dia_Select_Link_Option', that.props.data, '70px', true)
                    },10)
                }}>編輯</span>:``}
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
        var reIndex=[]
        function loadData(){
            gBundle.data.index=that.index

            glitter.postRequest("Kmu", "getPro", {
                name: 'setLinkPosition'
            }, function (response) {
                if (response === undefined) {
                loadData()
                } else {
                    if (response.result) {
                        if(response.data!==''){
                            reIndex=JSON.parse(response.data)
                        }
                        gBundle.excute(gBundle.data,function (response){
                            decodeResponse(response)
                        })
                    }
                }
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
                        that.isBtn=true
                        var data=response.data
                        var data2=[]
                        reIndex.map(function (dd){
                            var da=data.filter(function (data2){
                                return dd===data2.id
                            })
                            if(da.length>0){
                                data2.push(da[0])
                            }
                        })
                        data=data.filter(function (data){
                            return reIndex.indexOf(``+data.id)===-1
                        })
                        data2=data2.concat(data)
                        that.setState({
                            isInfiniteLoading: false,
                            elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(response.data.length,50)),
                            data:that.state.data.concat(data2)
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
        infiView=that
        publicShare.changeItemHeight=function (index,height){
            if(that.state.elementHeights[index]===height){return}
            that.state.elementHeights[index]=height
            that.setState({});
        }
        filterText=function (){
            searchText=$('#serch').val()
            that.setState({})
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
var infiView=undefined
let searchText=''
let filterText=function (){}
var viewHeight=0
var timer=setInterval(function (){
    if(document.getElementById('UserSelect')){
        viewHeight=$('#UserSelect').height()
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('UserSelect'));
        clearInterval(timer)
    }
},100)

//選擇回條
var userSelectCallback=function (data){
    glitter.runJsInterFace("OutWeb",{data:data.link},function (response){})
};



