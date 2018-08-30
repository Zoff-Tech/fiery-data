!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("FieryData",[],t):"object"==typeof exports?exports.FieryData=t():e.FieryData=t()}(this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=9)}([function(e,t,r){"use strict";function n(e){return"[object Object]"===Object.prototype.toString.call(e)}function o(e){return"string"==typeof e}function i(e){return e&&e instanceof Array}function a(e){return e&&e instanceof Date}function s(e){return void 0!==e}Object.defineProperty(t,"__esModule",{value:!0}),t.isObject=n,t.isFunction=function(e){return"function"==typeof e},t.isString=o,t.isArray=i,t.isDate=a,t.isDefined=s,t.coalesce=function(e,t){return s(e)?e:t},t.isCollectionSource=function(e){return!!e.where},t.getFields=function(e,t){return e?o(e)?[e]:e:t},t.forEach=function(e,t){if(i(e)){for(var r=0;r<e.length;r++)t(e[r],r,e);return!0}if(n(e)){for(var o in e)e.hasOwnProperty(o)&&t(e[o],o,e);return!0}return!1},t.isEqual=function e(t,r){if(t===r)return!0;if(!t||!r)return!1;if(typeof t!=typeof r)return!1;if(i(t)&&i(r)){if(t.length!==r.length)return!1;for(var o=0;o<t.length;o++)if(!e(t[o],r[o]))return!1;return!0}if(a(t)&&a(r))return t.getTime()===r.getTime();if(n(t)&&n(r)){for(var s in t)if(!e(t[s],r[s]))return!1;for(var s in r)if(!(s in t))return!1;return!0}return!1}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),o=r(6),i=r(8),a=r(2);function s(e,r,o){void 0===o&&(o=!1);var i=e.storeKey+n.UID_SEPARATOR+r.path;if(i in t.globalCache)return d(t.globalCache[i],e,o),t.globalCache[i];var a=e.options.newDocument();a[n.PROP_UID]=i;var s={uid:i,data:a,ref:r,exists:!1,uses:0,sub:{},firstEntry:e,entries:[],removed:!1};return t.globalCache[i]=s,d(s,e,!0),v(a,e),s}function c(e){return t.globalCache[e[n.PROP_UID]]}function u(e,t){if(t&&t.uid in e.children){e.options;var r=t.entries,n=r.indexOf(e);-1!==n&&r.splice(n,1),delete e.children[t.uid];for(var i=!1,a=0;a<r.length;a++)if(r[a].instance===e.instance){i=!0;break}if(i||l(t,e.instance,!0),t.uses>0)for(var s in t.sub)f(t,s)||o.closeEntry(t.sub[s],!0)}}function f(e,t){for(var r=e.entries,n=(e.sub,0);n<r.length;n++){var o=r[n].options.sub;if(o&&t in o)return!0}return!1}function d(e,t,r){void 0===r&&(r=!1),e.uid in t.instance.cache||(t.instance.cache[e.uid]=e,e.uses++),e.uid in t.children?r&&g(e,t):(e.entries.push(t),t.children[e.uid]=e,g(e,t))}function l(e,t,r){if(void 0===r&&(r=!0),e.uid in t.cache){e.uses--,delete t.cache[e.uid];for(var n=e.entries,o=n.length-1;o>=0;o--){var i=n[o];i.instance===t&&u(i,e)}r&&e.uses<=0&&p(e)}}function p(e){for(var r=e.entries,n=0;n<r.length;n++)l(e,r[n].instance,!1);for(var i in e.sub)o.closeEntry(e.sub[i],!0);e.uses<=0&&!e.removed&&(delete t.globalCache[e.uid],delete e.ref,delete e.sub,delete e.data,e.entries.length=0,e.removed=!0)}function g(e,t){var r=t.options,a=e.data,s=e.ref;if(r.sub&&s)for(var c in r.sub)if(!y(e,c)){var u=r.sub[c],f=e.uid+n.ENTRY_SEPARATOR+c,d=u.doc?s.parent.doc(e.uid.split(n.PATH_SEPARATOR).pop()+n.PATH_SEPARATOR+c):s.collection(c),l=o.getEntry(t.instance,d,u,f,!1);l.parent=e,e.sub[c]=l,a[c]=i.factory(l)}}function y(e,t){return t in e.sub&&e.sub[t].live}function v(e,t){return t.options.record&&Object.defineProperties(e,t.recordProperties),e}t.globalCache={},t.getCacheForReference=s,t.getCacheForDocument=function(e,t,r){return void 0===r&&(r=!1),a.stats.reads++,s(e,t.ref,r)},t.getCacheForData=c,t.removeDataFromEntry=function(e,t){u(e,c(t))},t.removeCacheFromEntry=u,t.isReferencedSub=f,t.addCacheToEntry=d,t.removeCacheFromInstance=l,t.destroyCache=p,t.addSubs=g,t.hasLiveSub=y,t.createRecord=v},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.stats={queries:0,reads:0,deletes:0,updates:0,sets:0,writes:0}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PROP_VALUE=".value",t.PROP_UID=".uid",t.UID_SEPARATOR="///",t.ENTRY_SEPARATOR="/",t.PATH_SEPARATOR="/",t.RECORD_OPTIONS={sync:"$sync",update:"$update",remove:"$remove",ref:"$ref",clear:"$clear",build:"$build",create:"$create",getChanges:"$getChanges"}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0);function o(e,t,r){for(var n in r)e.setProperty(t,n,r[n]);return t}function i(e,t){if(t.decode)e=t.decode(e);else if(t.decoders)for(var r in t.decoders)r in e&&(e[r]=t.decoders[r](e[r],e));return e}function a(e,t){var r,o=e.data(),i=n.isObject(o)?o:((r={})[t.propValue]=o,r);return i&&t.key&&(i[t.key]=e.id),i}t.refreshData=function(e,t,r){var n=r.instance.system,s=r.options,c=i(a(t,s),s),u=e.data;return o(n,u,c),s.propExists&&n.setProperty(u,s.propExists,t.exists),s.propParent&&r.parent&&n.setProperty(u,s.propParent,r.parent.data),e.exists=t.exists,u},t.copyData=o,t.decodeData=i,t.encodeData=function(e,t,r){var o={},i=n.getFields(r,t.include);if(i)for(var a=0;a<i.length;a++)(s=i[a])in e&&(o[s]=e[s]);else for(var s in e)s in t.exclude||(o[s]=e[s]);if(t.encoders)for(var s in t.encoders)s in o&&(o[s]=t.encoders[s](o[s],e));return o},t.parseDocument=a},function(e,t,r){"use strict";var n=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=r(3),i=r(0);function a(e,r){if(r)for(var n in t.mergeOptions){var o=n,i=t.mergeOptions[o];e[o]=i(e[o],r[o])}}t.globalOptions={defined:{},user:void 0,defaults:{onError:function(e){},onMissing:function(){},onSuccess:function(e){},onRemove:function(){},liveOptions:{},propValue:o.PROP_VALUE,recordOptions:o.RECORD_OPTIONS,newDocument:function(e){return{}}},id:0,map:{}},t.getOptionsByKey=function(e){return t.globalOptions.map[parseInt(e)]},t.getOptions=function e(r,n){if(i.isString(r)){if(!(r in t.globalOptions.defined))throw"The definition "+r+" was not found. You must call define before you use the definition";return e(t.globalOptions.defined[r])}if(r&&i.isObject(r)||(r={}),r.id&&r.id in t.globalOptions.map)return r;if(r.id||(r.id=++t.globalOptions.id,t.globalOptions.map[r.id]=r),r.extends&&a(r,e(r.extends)),a(r,t.globalOptions.user),a(r,t.globalOptions.defaults),n&&!r.shared&&(r.instance=n,n.options[r.id]=r),r.type){var s=r.type;r.newDocument=function(e){return new s}}r.newCollection||(r.newCollection=r.map?function(){return{}}:function(){return[]});var c={};if(r.exclude?i.isArray(r.exclude)?i.forEach(r.exclude,function(e,t){return c[e]=!0}):c=r.exclude:r.key&&(c[r.key]=!0),c[r.propValue]=!0,c[o.PROP_UID]=!0,i.forEach(r.recordOptions,function(e,t){return c[e]=!0}),r.exclude=c,r.sub)for(var u in r.sub){var f=e(r.sub[u],n);f.parent=r,r.sub[u]=f,f.ref||(c[u]=!0)}return r},t.recycleOptions=function(e){var t=e.instance;t&&delete t.options[e.id]},t.define=function(e,r){if(i.isString(e))(o=r).shared=!0,t.globalOptions.defined[e]=o;else for(var n in e){var o;(o=e[n]).shared=!0,t.globalOptions.defined[n]=o}},t.setGlobalOptions=function(e){e&&(e.shared=!0),t.globalOptions.user=e},t.performMerge=a,t.mergeStrategy={ignore:function(e,t){return e},replace:function(e,t){return i.coalesce(e,t)},chain:function(e,t){return i.isDefined(t)?i.isDefined(e)?function(){t.apply(this,arguments)(e).apply(this,arguments)}:t:e},shallow:function(e,t){return i.isDefined(t)?i.isDefined(e)?n({},t,e):t:e},concat:function(e,t){if(!i.isDefined(t))return e;if(!i.isDefined(e))return t;if(i.isArray(e)&&i.isArray(t)){for(var r=e.concat(t),n={},o=r.length-1;o>=0;o--)r[o]in n?r.splice(o,1):n[r[o]]=!0;return r}},exclude:function(e,r){var n=t.mergeStrategy.concat(e,r);if(!n&&e&&r){var o={},a=i.isArray(r),s=i.isArray(e);return i.forEach(r,function(e,t){return e?o[a?e:t]=!0:0}),i.forEach(e,function(e,t){return e?o[s?e:t]=!0:0}),o}return n}},t.mergeOptions={extends:t.mergeStrategy.ignore,id:t.mergeStrategy.ignore,parent:t.mergeStrategy.ignore,shared:t.mergeStrategy.ignore,vm:t.mergeStrategy.ignore,key:t.mergeStrategy.replace,query:t.mergeStrategy.replace,map:t.mergeStrategy.replace,once:t.mergeStrategy.replace,type:t.mergeStrategy.replace,nullifyMissing:t.mergeStrategy.replace,newDocument:t.mergeStrategy.replace,newCollection:t.mergeStrategy.replace,decode:t.mergeStrategy.replace,decoders:t.mergeStrategy.shallow,encoders:t.mergeStrategy.shallow,record:t.mergeStrategy.replace,recordOptions:t.mergeStrategy.replace,recordFunctions:t.mergeStrategy.replace,propValue:t.mergeStrategy.replace,propExists:t.mergeStrategy.replace,propParent:t.mergeStrategy.replace,onceOptions:t.mergeStrategy.replace,liveOptions:t.mergeStrategy.replace,include:t.mergeStrategy.concat,exclude:t.mergeStrategy.exclude,onError:t.mergeStrategy.replace,onSuccess:t.mergeStrategy.replace,onMissing:t.mergeStrategy.replace,onRemove:t.mergeStrategy.replace,sub:t.mergeStrategy.shallow}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(5),i=r(10),a=r(1),s=r(7);function c(e,t){if(void 0===t&&(t=!1),e&&e.live&&(e.off&&(e.off(),delete e.off),e.live=!1,t)){var r=e.instance;n.isDefined(e.index)&&(r.entryList[e.index]=null,delete e.index),e.name&&e.name in r.entry&&delete r.entry[e.name],n.forEach(e.children,function(t){a.removeCacheFromEntry(e,t)})}}function u(e){return{sync:function(t){return s.sync.call(e,this,t)},update:function(t){return s.update.call(e,this,t)},remove:function(t){return void 0===t&&(t=!1),s.remove.call(e,this,t)},ref:function(t){return s.ref.call(e,this,t)},clear:function(t){return s.clear.call(e,this,t)},build:function(t,r){return s.buildSub.call(e,this,t,r)},create:function(t,r){return s.createSub.call(e,this,t,r)},getChanges:function(t,r){return s.getChanges.call(e,this,t,r)}}}function f(e,t){var r={};for(var n in e.recordOptions){r[e.recordOptions[n]]={value:t[n]}}return r}t.closeEntry=c,t.getEntry=function(e,t,r,n,a){void 0===a&&(a=!0);var s=o.getOptions(r,e),d=i.getStoreKey(t);if(n&&n in e.entry){var l=e.entry[n];return c(l),s.id!==l.options.id&&o.recycleOptions(l.options),l.source=t,l.options=s,l.storeKey=d,l.live=!0,n&&a&&(e.sources[n]=t),l}var p=u(e),g={name:n,options:s,source:t,instance:e,storeKey:d,children:{},recordFunctions:p,recordProperties:f(s,p),live:!0};return n&&n in e.entry||(g.index=e.entryList.length,e.entryList.push(g)),n&&(e.entry[n]=g),n&&a&&(e.sources[n]=t),g},t.getEntryRecordFunctions=u,t.getEntryRecordProperties=f},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(4),o=r(0),i=r(1),a=r(2);function s(e,t){var r=this;void 0===t&&(t=!1);var n=i.getCacheForData(e);if(n&&n.ref){var c=n.firstEntry.options;if(!t&&c.sub)for(var u in c.sub)o.forEach(e[u],function(e){s.call(r,e)});return a.stats.deletes++,n.ref.delete()}return Promise.reject("The given data is out of scope and cannot be operated on.")}function c(e,t,r){var n=t.options,a=e.doc(),s=i.getCacheForReference(t,a);return n.defaults&&o.forEach(n.defaults,function(e,t){r&&t in r||(s.data[t]=o.isFunction(e)?e():e)}),r&&o.forEach(r,function(e,t){s.data[t]=e}),s.data}t.update=function(e,t){var r=i.getCacheForData(e);if(Promise.resolve(!1),r&&r.ref){var o=r.firstEntry.options,s=n.encodeData(e,o,t);return a.stats.writes++,r.exists?(a.stats.updates++,r.ref.update(s)):(a.stats.sets++,r.ref.set(s))}return Promise.reject("The given data is out of scope and cannot be operated on.")},t.sync=function(e,t){var r=i.getCacheForData(e);if(r&&r.ref){var o=r.firstEntry.options,s=n.encodeData(e,o,t);return a.stats.sets++,a.stats.writes++,r.ref.set(s)}return Promise.reject("The given data is out of scope and cannot be operated on.")},t.remove=s,t.clear=function(e,t){var r=this,n=i.getCacheForData(e),c=o.getFields(t);if(n&&n.ref){for(var u=n.firstEntry.options,f=n.ref,d=f.firestore,l=[],p={},g=0,y=0,v=c;y<v.length;y++){var h=v[y];if(u.sub&&h in u.sub&&e[h])o.forEach(e[h],function(e){l.push(s.call(r,e))});else if(h in e){var m=d.app.firebase_;m&&(p[h]=m.firestore.FieldValue.delete(),g++)}}return g>0&&(a.stats.updates++,a.stats.writes++,l.push(f.update(p))),Promise.all(l)}return Promise.reject("The given data is out of scope and cannot be operated on.")},t.getChanges=function(e,t,r){var s=i.getCacheForData(e);if(s&&s.ref){var c=o.isFunction(t)?void 0:o.getFields(t),u=(c?r:t)||o.isEqual,f=s.firstEntry.options,d=n.encodeData(e,f,c);a.stats.reads++;var l=s.ref.get();return new Promise(function(e,t){l.then(function(t){var r=n.parseDocument(t,f),o={},i={},a=!1;for(var s in d){var c=r[s],l=d[s];u(c,l)||(a=!0,o[s]=c,i[s]=l)}e({changed:a,remote:o,local:i})}),l.catch(function(e){return t(e)})})}return Promise.reject("The given data is out of scope and cannot be operated on.")},t.ref=function(e,t){var r=i.getCacheForData(e);if(r&&r.ref){var n=r.ref;return t?n.collection(t):n}throw"The given data is out of scope and cannot be referenced."},t.create=function(e,t){var r=this.build(e,t);return r&&this.sync(r),r},t.createSub=function(e,t,r){var n=this.buildSub(e,t,r);return n&&this.sync(n),n},t.build=function(e,t){var r;if(o.isString(e)){if(e in this.entry)return c((r=this.entry[e]).source,r,t)}else if(r=this.entryFor(e))return c(r.source,r,t);throw"Cannot build "+e+NaN},t.buildSub=function(e,t,r){var n=i.getCacheForData(e);if(n&&n.ref&&t in n.sub){var o=n.sub[t];return c(n.ref.collection(t),o,r)}throw"Cannot build in the sub collection "+t+NaN},t.buildFromCollection=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=r(12),i=r(13);function a(e){return(e.source.where?e.options.map?o.default:i.default:n.default)(e)}t.factory=a,t.default=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(5);t.define=n.define,t.setGlobalOptions=n.setGlobalOptions,t.mergeStrategy=n.mergeStrategy,t.mergeOptions=n.mergeOptions;var o=r(1);t.getCacheForData=o.getCacheForData,t.destroyCache=o.destroyCache;var i=r(14),a=r(2);t.stats=a.stats,function(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}(r(3)),t.default=i.getInstance},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.stores={keyNext:0,map:{},idToKey:{}},t.getStoreKey=function(e){var r=e.firestore,n=r.app.name,o=t.stores.idToKey[n];return o||(o=++t.stores.keyNext,t.stores.map[o]=r,t.stores.idToKey[n]=o),o}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(4),o=r(1),i=r(2);function a(e){var t=e.source,r=e.options,n=o.getCacheForReference(e,t,!0),a=e.target,c=!1,u=function(t){s(n,e,t),c=!t.exists};return a&&a!==n.data&&o.removeDataFromEntry(e,a),e.target=n.data,i.stats.queries++,r.once?e.promise=t.get(r.onceOptions).then(u).catch(r.onError):e.off=t.onSnapshot(r.liveOptions,u,r.onError),c&&r.nullifyMissing?null:e.target}function s(e,t,r){var i=t.options,a=t.instance.system;r.exists?(n.refreshData(e,r,t),i.onSuccess(e.data)):(i.propExists&&a.setProperty(e.data,i.propExists,!1),e.exists=!1,i.nullifyMissing&&(o.destroyCache(e),t.name&&a.removeNamed(t.name)))}t.factory=a,t.handleDocumentUpdate=s,t.default=a},function(e,t,r){"use strict";var n=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),i=r(4),a=r(1),s=r(2);t.default=function(e){var t=e.options,r=t.query?t.query(e.source):e.source,c=function(e){var t=e.options,r=e.instance.system;return function(s){var c=e.target,u=n({},c);s.forEach(function(t){var n=a.getCacheForDocument(e,t,!0);i.refreshData(n,t,e),r.setProperty(c,t.id,n.data),delete u[t.id]},t.onError),o.forEach(u,function(e,t){return r.removeProperty(c,t)}),o.forEach(u,function(t){return a.removeDataFromEntry(e,t)}),t.onSuccess(c)}}(e);return e.target||(e.target=t.newCollection()),s.stats.queries++,t.once?e.promise=r.get(t.onceOptions).then(c).catch(t.onError):e.off=r.onSnapshot(t.liveOptions,function(e,t){var r=function(e){var t=e.options,r=e.instance.system;return function(n){var o=e.target;n.docChanges().forEach(function(n){var s=n.doc,c=a.getCacheForDocument(e,s);switch(n.type){case"modified":case"added":var u=i.refreshData(c,s,e);r.setProperty(o,s.id,u);break;case"removed":r.removeProperty(o,s.id),s.exists?a.removeCacheFromEntry(e,c):(t.propExists&&r.setProperty(c.data,t.propExists,!1),c.exists=!1,a.destroyCache(c))}},t.onError),t.onSuccess(o)}}(e),n=t;return function(e){n(e),n=r}}(e,c),t.onError),e.target}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),o=r(4),i=r(1),a=r(0),s=r(2);function c(e){var t=e.options,r=t.query?t.query(e.source):e.source,c=function(e){var t=e.options,r=e.instance.system,s=e.target;return function(c){var u=e.target,f={};if(s)for(var d=0;d<u.length;d++){var l=u[d];f[l[n.PROP_UID]]=l}r.arrayResize(u,0),c.forEach(function(t){var n=i.getCacheForDocument(e,t,!0);o.refreshData(n,t,e),r.arrayAdd(u,n.data),delete f[n.uid]},t.onError),a.forEach(f,function(t){return i.removeDataFromEntry(e,t)}),t.onSuccess(u)}}(e);return e.target||(e.target=t.newCollection()),s.stats.queries++,t.once?e.promise=r.get(t.onceOptions).then(c).catch(t.onError):e.off=r.onSnapshot(t.liveOptions,function(e,t){var r=function(e){var t=e.options,r=e.instance.system;return function(n){var a=e.target;n.docChanges().forEach(function(n){var s=n.doc,c=i.getCacheForDocument(e,s);switch(n.type){case"added":var u=o.refreshData(c,s,e);r.arraySet(a,n.newIndex,u);break;case"removed":s.exists?i.removeCacheFromEntry(e,c):(t.propExists&&r.setProperty(c.data,t.propExists,!1),c.exists=!1,i.destroyCache(c));break;case"modified":var f=o.refreshData(c,s,e);n.oldIndex!==n.newIndex&&r.arraySet(a,n.newIndex,f)}},t.onError),r.arrayResize(a,n.size),t.onSuccess(a)}}(e),n=t;return function(e){n(e),n=r}}(e,c),t.onError),e.target}t.factory=c,t.default=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(8),i=r(6),a=r(1),s=r(5),c=r(7);function u(){var e=this;n.forEach(this.options,function(e){return delete s.globalOptions.map[e.id]}),n.forEach(this.cache,function(t){return a.removeCacheFromInstance(t,e)}),n.forEach(this.entryList,function(e){return i.closeEntry(e,!0)}),this.entry={},this.entryList=[],this.options={},this.sources={},this.cache={}}function f(e){var t=this.entryFor(e);null!==t&&i.closeEntry(t,!0)}function d(e){for(var t=this.entryList,r=0;r<t.length;r++){var n=t[r];if(n&&n.target===e)return n}return null}function l(e){for(var t=this.entryList,r=0;r<t.length;r++){var n=t[r];if(null!==n)if(!n.options.parent&&!n.name)for(var o in e)if(e[o]===n.target){n.name=o,this.entry[o]=n,this.sources[o]=n.source;break}}}t.getInstance=function(e){var t=function(e){var t=e||{};for(var r in p){var n=r;n in t||(t[n]=p[n])}return t}(e),r=function(e,t,n){return o.factory(i.getEntry(r,e,t,n))};return r.system=t,r.entry={},r.entryList=[],r.options={},r.sources={},r.cache={},r.update=c.update,r.sync=c.sync,r.remove=c.remove,r.clear=c.clear,r.getChanges=c.getChanges,r.ref=c.ref,r.create=c.create,r.createSub=c.createSub,r.build=c.build,r.buildSub=c.buildSub,r.entryFor=d,r.destroy=u,r.free=f,r.linkSources=l,r};var p={removeNamed:function(e){},setProperty:function(e,t,r){e[t]=r},removeProperty:function(e,t){delete e[t]},arraySet:function(e,t,r){e[t]=r},arrayAdd:function(e,t){e.push(t)},arrayResize:function(e,t){e.length=t}}}])});
//# sourceMappingURL=fiery-data.js.map