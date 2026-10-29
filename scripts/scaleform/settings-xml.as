// Experimental, UNTESTED in FiveM. Read only the two known saved-settings paths.
// Separate empty movie: no pause-menu imports, activation, navigation or input.
_global.gfxExtensions = true;
this.TIMELINE = this;
this._reads = [];
this._started = false;
this.START = function()
{
   if(this._started) return "LXML1";
   this._started = true;
   var paths = ["fxd:/gta5_settings.xml", "user:/settings.xml"];
   for(var i = 0; i < 4; i++)
   {
      var entry = {state:"loading", hex:"", loader:null};
      this._reads.push(entry);
      var ctor = i % 2 == 0 ? _global.LoadVars : _global.XML;
      if(typeof(ctor) != "function")
      {
         entry.state = "unsupported";
         continue;
      }
      var loader = new ctor();
      entry.loader = loader;
      if(typeof(loader.load) != "function")
      {
         entry.state = "unsupported";
         continue;
      }
      loader._entry = entry;
      loader.onData = function(raw)
      {
         var target = this._entry;
         if(raw == undefined || raw == null || raw.length == 0)
         {
            target.state = "failed";
            return;
         }
         if(typeof(raw) != "string" || raw.length > 16384)
         {
            target.state = "tooLarge";
            return;
         }
         var digits = "0123456789abcdef";
         var encoded = "";
         for(var j = 0; j < raw.length; j++)
         {
            var c = raw.charCodeAt(j);
            encoded += digits.charAt((c >> 12) & 15) + digits.charAt((c >> 8) & 15) + digits.charAt((c >> 4) & 15) + digits.charAt(c & 15);
         }
         target.hex = encoded;
         target.state = "ready";
      };
      if(loader.load(paths[Math.floor(i / 2)]) == false && entry.state == "loading") entry.state = "failed";
   }
   return "LXML1";
};
this.INFO = function(index)
{
   var entry = this._reads[index];
   if(entry == undefined) return "LXML1|invalid|0";
   return "LXML1|" + entry.state + "|" + entry.hex.length;
};
this.CHUNK = function(index, offset)
{
   var entry = this._reads[index];
   if(entry == undefined || entry.state != "ready" || offset < 0 || offset >= entry.hex.length || offset % 48 != 0) return "";
   return entry.hex.substr(offset,48);
};
