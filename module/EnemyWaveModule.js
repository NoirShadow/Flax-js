/**
 * Created by long on 14-7-11.
 */
var lg = lg || {};
/**
 * var waves = [{types:["enemy1","enemy2"],count:5,interval:[3,5],gap:5},
 *             {types:["enemy1","enemy2"],count:5,interval:[3,5],gap:5},
 *             {types:["enemy1","enemy2"],count:5,interval:[3,5],gap:5}
 *             ...]
 * Set waves and waveAssetJson, if need, override the _doCreateEnemy function
 * */
lg.EnemyWaveModule = {
    waveAssetJson:null,
    waves:null,
    onWaveBegin:null,
    onEnemyIn:null,
    onWaveOver:null,
    batchCanvas:null,
    currentWave:-1,
    totalWaves:0,
    wavePaused:true,
    waveOver:false,
    _waveDefine:null,
    _enemyCount:0,
    onEnter:function()
    {
        this.totalWaves = this.waves.length;
        this.onWaveBegin = new signals.Signal();
        this.onEnemyIn = new signals.Signal();
        this.onWaveOver = new signals.Signal();
        if(!this.wavePaused){
            this.nextWave();
        }
    },
    onExit:function(){
        this.onWaveBegin.removeAll();
        this.onEnemyIn.removeAll();
        this.onWaveOver.removeAll();
    },
    startWave:function()
    {
        if(!this.wavePaused) return;
        this.wavePaused = false;
        this.nextWave();
    },
    stopWave:function()
    {
        if(this.wavePaused) return;
        this.wavePaused = true;
    },
    nextWave:function()
    {
        if(this.wavePaused || this.waveOver) return;
        this._enemyCount = 0;
        this.currentWave++;
        this._waveDefine = this.waves[this.currentWave];
        this._createWaveEnemy();
        this.onWaveBegin.dispatch();
    },
    _createWaveEnemy:function()
    {
        if(this.wavePaused || this.waveOver) return;
        var assetID = lg.getRandomInArray(this._waveDefine.types);
        var enemy = this._doCreateEnemy(assetID);
        this.onEnemyIn.dispatch(enemy);
        if(++this._enemyCount < this._waveDefine.count){
            var interval = lg.randInt(parseInt(this._waveDefine.interval[0]), parseInt(this._waveDefine.interval[1]));
            this.scheduleOnce(function(){
                this._createWaveEnemy();
            },interval);
        }else if(this.currentWave == this.totalWaves - 1){
            this.waveOver = true;
            this.onWaveOver.dispatch();
        }else{
            this.nextWave();
        }
    },
    _doCreateEnemy:function(assetID){
        if(this.waveAssetJson) lg.assetsManager.createDisplay(this.waveAssetJson, assetID, null, true, this.batchCanvas, {x: this.x, y: this.y});
        //override this function yourself
    }
}