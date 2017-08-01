/**
 * Created by Administrator on 2017/1/14.
 */

//rem单位换算
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//page分页效果
function showPage() {
    var startY=0;
    var endY=0;
    var disY=0;
    var len=$(".show_page").length;
    var curPage=0;//默认显示第一个
    var nextPage=curPage+1;//下一页
    var prePage=(curPage-1+len)%len;
    var height=$(".show_page").outerHeight(true);
    var maxMove=Math.floor(height/4) ;
    var $cur=$(".show_page").eq(curPage);
    var $next=$(".show_page").eq(nextPage);
    var $pre=$(".show_page").eq(prePage);
    var isMove=false;
    var startTime=0;
    var endTime=0;
    function getY(e) {
        var touch=e.originalEvent.targetTouches[0];
        return touch.pageY;
    }
    $(".show_page").on("touchstart",function (e) {
        startTime=(new Date()).getTime();
        startY=getY(e);
        $next.css({"top":height+"px"});
        isMove=true;
        $next.addClass("next").siblings(".show_page").removeClass("next");
        $pre.addClass("pre").siblings("").removeClass("pre");
        $pre.css({"top":-height+"px"});
        e.preventDefault();
    });
    $(document).on("touchmove",function (e) {
        if(!isMove){
            return false;
        }
        endY=getY(e);
        disY=endY-startY;
        //console.log(disY+"  ,  top:"+(height+disY)  );
        if(disY<0){
            //情况一  手势向下滑动
            $next.css({top:(height+disY)+"px"});
        }else{
            //情况一  手势向上滑动
            $pre.css({top:-(height-disY)+"px"});
        }
        e.preventDefault();
    });
    $(document).on("touchend",function (e) {
        if(!isMove){
            return false;
        }
        isMove=false;
        endTime=(new Date()).getTime();
        var speed=Math.abs(startY-endY)/(endTime-startTime);
        //console.log(speed);
        //情况一 手指向下滑动
        if(startY-endY>0){
            //向下滚动一屏幕
            if(startY -endY>maxMove || speed>0.4){
                $next.animate({top:"0"},200,function () {
                    //next运动到顶部改变cur 以及 next的指向的
                    prePage=curPage;//改变pre为当前的page
                    curPage++;
                    if(curPage==len){
                        curPage=0;
                    }
                    nextPage=curPage+1;
                    if(nextPage==len){
                        nextPage=0;
                    }
                    $pre.removeClass("pre");
                    $cur.removeClass("cur");
                    $cur.addClass("pre");
                    $next.addClass("cur").removeClass("next");
                    $pre=$cur;
                    $cur=$next;
                    $next=$(".show_page").eq(nextPage);
                    $next.css({"top":height+"px"});
                    $pre.css({"top":-height+"px"});
                    $next.addClass("next");
                });
            }else{
                $next.animate({top:height+"px"},50);
            }
        }
        //情况二 手指向上滑动
        if(endY-startY>0){
            if(endY-startY>maxMove || speed>0.4){
                $pre.animate({top:"0"},200,function () {
                    nextPage=curPage;//改变next为当前的page
                    curPage--;
                    if(curPage<0){
                        curPage=len-1;
                    }
                    prePage=curPage-1;
                    if(prePage<0){
                        prePage=len-1;
                    }
                    $pre.removeClass("pre");
                    $cur.removeClass("cur");
                    $pre.addClass("cur").removeClass("pre");
                    $cur.addClass("next");
                    $next=$cur;
                    $cur=$pre;
                    $pre=$(".show_page").eq(prePage);
                    $pre.css({"top":-height+"px"});
                    $next.css({"top":height+"px"});
                    $pre.addClass("pre");
                });
            }else{
                //不发生切换页面
                $pre.animate({top:-height+"px"},50);
            }
        }
        e.preventDefault();
    });

}

$(function () {
    //分页效果的调用
    showPage();
});















