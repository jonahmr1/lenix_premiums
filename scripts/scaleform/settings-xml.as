// Experimental, UNTESTED in FiveM. Only the two known saved-settings paths.
// Empty movie: no pause-menu imports, activation, navigation or input.
_global.gfxExtensions = true;
this.TIMELINE = this;
this._reads = [];
this._started = false;
this._save = function(entry, raw)
{
   if(raw == undefined || raw == null || raw.length == 0)
   {
      entry.state = "failed";
      return;
   }
   if(typeof(raw) != "string" || raw.length > 16384)
   {
      entry.state = "tooLarge";
      return;
   }
   var digits = "0123456789abcdef";
   var encoded = "";
   for(var j = 0; j < raw.length; j++)
   {
      var c = raw.charCodeAt(j);
      encoded += digits.charAt((c >> 12) & 15) + digits.charAt((c >> 8) & 15) + digits.charAt((c >> 4) & 15) + digits.charAt(c & 15);
   }
   entry.hex = encoded;
   entry.state = "ready";
};
this.START = function()
{
   if(this._started) return "LXML2";
   this._started = true;
   var paths = ["fxd:/gta5_settings.xml", "user:/settings.xml"];
   for(var i = 0; i < 6; i++)
   {
      var entry = {state:"loading", hex:"", loader:null, legacy:i % 3 == 2};
      this._reads.push(entry);
      if(entry.legacy)
      {
         var clip = this.createEmptyMovieClip("_xmlFile" + i,this.getNextHighestDepth());
         entry.loader = clip;
         if(typeof(clip.loadVariables) != "function") entry.state = "unsupportedLoad";
         else clip.loadVariables(paths[Math.floor(i / 3)]);
         continue;
      }
      var ctor = i % 3 == 0 ? _global.LoadVars : _global.XML;
      if(typeof(ctor) != "function")
      {
         entry.state = "unsupportedConstructor";
         continue;
      }
      var loader = new ctor();
      entry.loader = loader;
      if(typeof(loader.load) != "function")
      {
         entry.state = "unsupportedLoad";
         continue;
      }
      loader._entry = entry;
      loader._save = this._save;
      loader.onData = function(raw) { this._save(this._entry,raw); };
      if(loader.load(paths[Math.floor(i / 3)]) == false && entry.state == "loading") entry.state = "failed";
   }
   return "LXML2";
};
this.INFO = function(index)
{
   var entry = this._reads[index];
   if(entry == undefined) return "LXML2|invalid|0";
   if(entry.legacy && entry.state == "loading")
   {
      // loadVariables parses form data, not XML. A plain GTA XML file becomes
      // one variable split at the first '='. Accept only a complete document;
      // the TS side validates every graphics/video value. Never reorder fragments.
      var count = 0;
      for(var key in entry.loader)
      {
         count++;
         if(count > 64) { entry.state = "tooLarge"; break; }
         if(key.indexOf("<?xml") == 0 || key.indexOf("<Settings") == 0 || key.indexOf("<?xml") == 1)
         {
            var value = entry.loader[key];
            if(typeof(value) != "string") { entry.state = "invalidData"; break; }
            if(key.length + value.length + 1 > 16384) { entry.state = "tooLarge"; break; }
            var raw = key + "=" + value;
            if(raw.indexOf("</Settings>") == -1) { entry.state = "invalidData"; break; }
            this._save(entry,raw);
            break;
         }
      }
   }
   return "LXML2|" + entry.state + "|" + entry.hex.length;
};
this.CHUNK = function(index, offset)
{
   var entry = this._reads[index];
   if(entry == undefined || entry.state != "ready" || offset < 0 || offset >= entry.hex.length || offset % 48 != 0) return "";
   return entry.hex.substr(offset,48);
};
