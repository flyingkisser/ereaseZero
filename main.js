/**
 * Created by joe on 16/4/1.
 */

require("./common-js/common/nodeRequireBase.js");


require("./common-js/common/dirMgr.js");
require("./common-js/common/fileMgr.js");

doJob={

    go:function(dirName){
        cc.log("parse %s",dirName);
        var exp=new RegExp(/([\d:]+)(\x20+)([\d\.]+)(\x20+)([\d\.]+)/g);
        var match=null

        ccsp.dirMgr.dirAsync(dirName,this,function(err,fileList){
            cc.logObj(fileList);
            for(var i in fileList){
                var fileName=dirName+"/"+fileList[i];
                ccsp.fileMgr.readStrAsyc(fileName,this,function(err,content,fname){
                    var j=0;
                    var findZeroNum=0;
                    var newFileName=fname+".txt";
                    var newstr="";
                    var zerostr="";
                    cc.log("read ok %s",fname);
                    cc.log("--------------------begin------------------");
                    while(match=exp.exec(content)){
                        //cc.logObj(match);
                        var time=match[1];
                        var col1=match[3];
                        var col2=match[5];



                        if(col1==col2 && col1=="0.00"){
                            findZeroNum++;
                            if(findZeroNum<=5)
                                zerostr+=time+" 0.00 0.00\r\n";
                            continue;
                        }

                        //if(findZeroNum>5){
                        //    cc.log("--------------------insert 0 here------------------");
                        //    zerostr="";
                        //    for(var k=0;k<5;k++)
                        //        zerostr+=time+" 0.00 0.00\r\n";
                        //}else if (findZeroNum){
                        //
                        //}else{
                        //    zerostr="";
                        //}
                        //cc.log("%d %s %s %s",j++,time,col1,col2);
                        newstr+=zerostr+time+" "+col1+" "+col2+"\r\n";
                        findZeroNum=0;
                        zerostr="";
                    }

                    ccsp.fileMgr.writeStrAsync(newFileName,newstr,this,function(){
                        cc.log("write %s ok",newFileName);
                    });
                    cc.log("--------------------end------------------");

                });
            }
        });
    }
};


var args=process.argv.splice(2);
if(!args || !args[0]){
    cc.log("ereaseZero:for zixuan.zhao to check files");
    cc.log("usage: ereaseZero dirName");
    return;
}

doJob.go(args[0]);