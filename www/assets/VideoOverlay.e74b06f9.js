import { l as createComponent, r as ref, m as computed, E as watch, x as onBeforeUnmount, P as cleanEvt, K as addEvt, n as h$1, ag as Transition, A as getCurrentInstance, p as hSlot, R as stopAndPrevent, a0 as _export_sfc, d as defineComponent, s as onMounted, h as openBlock, c as createElementBlock, a as createBaseVNode, w as withDirectives, v as vShow, u as unref, a3 as createTextVNode, t as toDisplayString, F as Fragment, g as renderList, a2 as createBlock, aG as withKeys, k as createCommentVNode, e as createVNode, f as withCtx, av as normalizeClass, Q as QBtn, aH as withModifiers, ai as pushScopeId, aj as popScopeId, z as nextTick } from "./index.454a89f7.js";
import { d as useAnchorProps, v as validatePosition, e as validateOffset, f as useScrollTarget, g as useAnchor, r as removeClickOutside, s as setPosition, p as parsePosition, h as addClickOutside, Q as QInput } from "./QInput.da73b6a6.js";
import { u as useModelToggleProps, d as useModelToggleEmits, e as useTimeout, f as useModelToggle, g as getScrollTarget } from "./use-timeout.a3e918be.js";
import { u as useTransitionProps, a as useTick, b as useTransition, c as usePortal, i as useQuasar, Q as QDialog } from "./use-quasar.2220b5e4.js";
import { c as clearSelection } from "./selection.231d774a.js";
import { a as QCard, Q as QCardSection } from "./QCard.c4835b97.js";
import { Q as QCardActions, C as ClosePopup } from "./ClosePopup.a4742f02.js";
import { a as getUserInfo, k as getSupabaseTokens, h as api$D, L as LanguageManager, B as BackendErrorCode, l as updateUserInfo, P as PracticeMode, m as traverseSubsegments } from "./axios.ead55ef2.js";
import "./use-dark.a20bd128.js";
var QTooltip = createComponent({
  name: "QTooltip",
  inheritAttrs: false,
  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useTransitionProps,
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },
    transitionShow: {
      default: "jump-down"
    },
    transitionHide: {
      default: "jump-up"
    },
    anchor: {
      type: String,
      default: "bottom middle",
      validator: validatePosition
    },
    self: {
      type: String,
      default: "top middle",
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [14, 14],
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    delay: {
      type: Number,
      default: 0
    },
    hideDelay: {
      type: Number,
      default: 0
    }
  },
  emits: [
    ...useModelToggleEmits
  ],
  setup(props, { slots, emit, attrs }) {
    let unwatchPosition, observer;
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;
    const innerRef = ref(null);
    const showing = ref(false);
    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl));
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl));
    const hideOnRouteChange = computed(() => props.persistent !== true);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    const { transitionProps, transitionStyle } = useTransition(props);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow, anchorEvents } = useAnchor({ showing, configureAnchorEl });
    const { show, hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    Object.assign(anchorEvents, { delayShow, delayHide });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent, "tooltip");
    if ($q.platform.is.mobile === true) {
      const clickOutsideProps = {
        anchorEl,
        innerRef,
        onClickOutside(e2) {
          hide(e2);
          if (e2.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e2);
          }
          return true;
        }
      };
      const hasClickOutside = computed(
        () => props.modelValue === null && props.persistent !== true && showing.value === true
      );
      watch(hasClickOutside, (val) => {
        const fn = val === true ? addClickOutside : removeClickOutside;
        fn(clickOutsideProps);
      });
      onBeforeUnmount(() => {
        removeClickOutside(clickOutsideProps);
      });
    }
    function handleShow(evt) {
      showPortal();
      registerTick(() => {
        observer = new MutationObserver(() => updatePosition());
        observer.observe(innerRef.value, { attributes: false, childList: true, characterData: true, subtree: true });
        updatePosition();
        configureScrollTarget();
      });
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl,
          updatePosition
        );
      }
      registerTimeout(() => {
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      hidePortal();
      anchorCleanup();
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup() {
      if (observer !== void 0) {
        observer.disconnect();
        observer = void 0;
      }
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      unconfigureScrollTarget();
      cleanEvt(anchorEvents, "tooltipTemp");
    }
    function updatePosition() {
      setPosition({
        targetEl: innerRef.value,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function delayShow(evt) {
      if ($q.platform.is.mobile === true) {
        clearSelection();
        document.body.classList.add("non-selectable");
        const target = anchorEl.value;
        const evts = ["touchmove", "touchcancel", "touchend", "click"].map((e2) => [target, e2, "delayHide", "passiveCapture"]);
        addEvt(anchorEvents, "tooltipTemp", evts);
      }
      registerTimeout(() => {
        show(evt);
      }, props.delay);
    }
    function delayHide(evt) {
      if ($q.platform.is.mobile === true) {
        cleanEvt(anchorEvents, "tooltipTemp");
        clearSelection();
        setTimeout(() => {
          document.body.classList.remove("non-selectable");
        }, 10);
      }
      registerTimeout(() => {
        hide(evt);
      }, props.hideDelay);
    }
    function configureAnchorEl() {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      const evts = $q.platform.is.mobile === true ? [
        [anchorEl.value, "touchstart", "delayShow", "passive"]
      ] : [
        [anchorEl.value, "mouseenter", "delayShow", "passive"],
        [anchorEl.value, "mouseleave", "delayHide", "passive"]
      ];
      addEvt(anchorEvents, "anchor", evts);
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        const fn = props.noParentEvent === true ? updatePosition : hide;
        changeScrollEvent(localScrollTarget.value, fn);
      }
    }
    function getTooltipContent() {
      return showing.value === true ? h$1("div", {
        ...attrs,
        ref: innerRef,
        class: [
          "q-tooltip q-tooltip--style q-position-engine no-pointer-events",
          attrs.class
        ],
        style: [
          attrs.style,
          transitionStyle.value
        ],
        role: "tooltip"
      }, hSlot(slots.default)) : null;
    }
    function renderPortalContent() {
      return h$1(Transition, transitionProps.value, getTooltipContent);
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(vm.proxy, { updatePosition });
    return renderPortal;
  }
});
let methods$o = {
  one: {},
  two: {},
  three: {},
  four: {}
};
let model$7 = {
  one: {},
  two: {},
  three: {}
};
let compute$e = {};
let hooks = [];
var tmpWrld = { methods: methods$o, model: model$7, compute: compute$e, hooks };
const isArray$9 = (input) => Object.prototype.toString.call(input) === "[object Array]";
const fns$5 = {
  compute: function(input) {
    const { world: world2 } = this;
    const compute2 = world2.compute;
    if (typeof input === "string" && compute2.hasOwnProperty(input)) {
      compute2[input](this);
    } else if (isArray$9(input)) {
      input.forEach((name) => {
        if (world2.compute.hasOwnProperty(name)) {
          compute2[name](this);
        } else {
          console.warn("no compute:", input);
        }
      });
    } else if (typeof input === "function") {
      input(this);
    } else {
      console.warn("no compute:", input);
    }
    return this;
  }
};
var compute$d = fns$5;
const forEach = function(cb) {
  let ptrs = this.fullPointer;
  ptrs.forEach((ptr, i2) => {
    let view = this.update([ptr]);
    cb(view, i2);
  });
  return this;
};
const map = function(cb, empty) {
  let ptrs = this.fullPointer;
  let res = ptrs.map((ptr, i2) => {
    let view = this.update([ptr]);
    let out2 = cb(view, i2);
    if (out2 === void 0) {
      return this.none();
    }
    return out2;
  });
  if (res.length === 0) {
    return empty || this.update([]);
  }
  if (res[0] !== void 0) {
    if (typeof res[0] === "string") {
      return res;
    }
    if (typeof res[0] === "object" && (res[0] === null || !res[0].isView)) {
      return res;
    }
  }
  let all2 = [];
  res.forEach((ptr) => {
    all2 = all2.concat(ptr.fullPointer);
  });
  return this.toView(all2);
};
const filter = function(cb) {
  let ptrs = this.fullPointer;
  ptrs = ptrs.filter((ptr, i2) => {
    let view = this.update([ptr]);
    return cb(view, i2);
  });
  let res = this.update(ptrs);
  return res;
};
const find$c = function(cb) {
  let ptrs = this.fullPointer;
  let found = ptrs.find((ptr, i2) => {
    let view = this.update([ptr]);
    return cb(view, i2);
  });
  return this.update([found]);
};
const some = function(cb) {
  let ptrs = this.fullPointer;
  return ptrs.some((ptr, i2) => {
    let view = this.update([ptr]);
    return cb(view, i2);
  });
};
const random = function(n2 = 1) {
  let ptrs = this.fullPointer;
  let r2 = Math.floor(Math.random() * ptrs.length);
  if (r2 + n2 > this.length) {
    r2 = this.length - n2;
    r2 = r2 < 0 ? 0 : r2;
  }
  ptrs = ptrs.slice(r2, r2 + n2);
  return this.update(ptrs);
};
var loops = { forEach, map, filter, find: find$c, some, random };
const utils = {
  termList: function() {
    return this.methods.one.termList(this.docs);
  },
  terms: function(n2) {
    let m2 = this.match(".");
    return typeof n2 === "number" ? m2.eq(n2) : m2;
  },
  groups: function(group) {
    if (group || group === 0) {
      return this.update(this._groups[group] || []);
    }
    let res = {};
    Object.keys(this._groups).forEach((k2) => {
      res[k2] = this.update(this._groups[k2]);
    });
    return res;
  },
  eq: function(n2) {
    let ptr = this.pointer;
    if (!ptr) {
      ptr = this.docs.map((_doc, i2) => [i2]);
    }
    if (ptr[n2]) {
      return this.update([ptr[n2]]);
    }
    return this.none();
  },
  first: function() {
    return this.eq(0);
  },
  last: function() {
    let n2 = this.fullPointer.length - 1;
    return this.eq(n2);
  },
  firstTerms: function() {
    return this.match("^.");
  },
  lastTerms: function() {
    return this.match(".$");
  },
  slice: function(min2, max2) {
    let pntrs = this.pointer || this.docs.map((_o, n2) => [n2]);
    pntrs = pntrs.slice(min2, max2);
    return this.update(pntrs);
  },
  all: function() {
    return this.update().toView();
  },
  fullSentences: function() {
    let ptrs = this.fullPointer.map((a2) => [a2[0]]);
    return this.update(ptrs).toView();
  },
  none: function() {
    return this.update([]);
  },
  isDoc: function(b) {
    if (!b || !b.isView) {
      return false;
    }
    let aPtr = this.fullPointer;
    let bPtr = b.fullPointer;
    if (!aPtr.length === bPtr.length) {
      return false;
    }
    return aPtr.every((ptr, i2) => {
      if (!bPtr[i2]) {
        return false;
      }
      return ptr[0] === bPtr[i2][0] && ptr[1] === bPtr[i2][1] && ptr[2] === bPtr[i2][2];
    });
  },
  wordCount: function() {
    return this.docs.reduce((count, terms) => {
      count += terms.filter((t2) => t2.text !== "").length;
      return count;
    }, 0);
  },
  isFull: function() {
    let ptrs = this.pointer;
    if (!ptrs) {
      return true;
    }
    if (ptrs.length === 0 || ptrs[0][0] !== 0) {
      return false;
    }
    let wantTerms = 0;
    let haveTerms = 0;
    this.document.forEach((terms) => wantTerms += terms.length);
    this.docs.forEach((terms) => haveTerms += terms.length);
    return wantTerms === haveTerms;
  },
  getNth: function(n2) {
    if (typeof n2 === "number") {
      return this.eq(n2);
    } else if (typeof n2 === "string") {
      return this.if(n2);
    }
    return this;
  }
};
utils.group = utils.groups;
utils.fullSentence = utils.fullSentences;
utils.sentence = utils.fullSentences;
utils.lastTerm = utils.lastTerms;
utils.firstTerm = utils.firstTerms;
var util = utils;
const methods$n = Object.assign({}, util, compute$d, loops);
methods$n.get = methods$n.eq;
var api$C = methods$n;
class View {
  constructor(document2, pointer, groups = {}) {
    [
      ["document", document2],
      ["world", tmpWrld],
      ["_groups", groups],
      ["_cache", null],
      ["viewType", "View"]
    ].forEach((a2) => {
      Object.defineProperty(this, a2[0], {
        value: a2[1],
        writable: true
      });
    });
    this.ptrs = pointer;
  }
  get docs() {
    let docs = this.document;
    if (this.ptrs) {
      docs = tmpWrld.methods.one.getDoc(this.ptrs, this.document);
    }
    return docs;
  }
  get pointer() {
    return this.ptrs;
  }
  get methods() {
    return this.world.methods;
  }
  get model() {
    return this.world.model;
  }
  get hooks() {
    return this.world.hooks;
  }
  get isView() {
    return true;
  }
  get found() {
    return this.docs.length > 0;
  }
  get length() {
    return this.docs.length;
  }
  get fullPointer() {
    let { docs, ptrs, document: document2 } = this;
    let pointers2 = ptrs || docs.map((_d, n2) => [n2]);
    return pointers2.map((a2) => {
      let [n2, start2, end2, id, endId] = a2;
      start2 = start2 || 0;
      end2 = end2 || (document2[n2] || []).length;
      if (document2[n2] && document2[n2][start2]) {
        id = id || document2[n2][start2].id;
        if (document2[n2][end2 - 1]) {
          endId = endId || document2[n2][end2 - 1].id;
        }
      }
      return [n2, start2, end2, id, endId];
    });
  }
  update(pointer) {
    let m2 = new View(this.document, pointer);
    if (this._cache && pointer && pointer.length > 0) {
      let cache2 = [];
      pointer.forEach((ptr, i2) => {
        let [n2, start2, end2] = ptr;
        if (ptr.length === 1) {
          cache2[i2] = this._cache[n2];
        } else if (start2 === 0 && this.document[n2].length === end2) {
          cache2[i2] = this._cache[n2];
        }
      });
      if (cache2.length > 0) {
        m2._cache = cache2;
      }
    }
    m2.world = this.world;
    return m2;
  }
  toView(pointer) {
    return new View(this.document, pointer || this.pointer);
  }
  fromText(input) {
    const { methods: methods2 } = this;
    let document2 = methods2.one.tokenize.fromString(input, this.world);
    let doc = new View(document2);
    doc.world = this.world;
    doc.compute(["normal", "lexicon"]);
    if (this.world.compute.preTagger) {
      doc.compute("preTagger");
    }
    return doc;
  }
  clone() {
    let document2 = this.document.slice(0);
    document2 = document2.map((terms) => {
      return terms.map((term) => {
        term = Object.assign({}, term);
        term.tags = new Set(term.tags);
        return term;
      });
    });
    let m2 = this.update(this.pointer);
    m2.document = document2;
    m2._cache = this._cache;
    return m2;
  }
}
Object.assign(View.prototype, api$C);
var View$1 = View;
var version = "14.10.0";
const isObject$6 = function(item) {
  return item && typeof item === "object" && !Array.isArray(item);
};
function mergeDeep(model2, plugin2) {
  if (isObject$6(plugin2)) {
    for (const key in plugin2) {
      if (isObject$6(plugin2[key])) {
        if (!model2[key])
          Object.assign(model2, { [key]: {} });
        mergeDeep(model2[key], plugin2[key]);
      } else {
        Object.assign(model2, { [key]: plugin2[key] });
      }
    }
  }
  return model2;
}
function mergeQuick(model2, plugin2) {
  for (const key in plugin2) {
    model2[key] = model2[key] || {};
    Object.assign(model2[key], plugin2[key]);
  }
  return model2;
}
const addIrregulars = function(model2, conj) {
  let m2 = model2.two.models || {};
  Object.keys(conj).forEach((k2) => {
    if (conj[k2].pastTense) {
      if (m2.toPast) {
        m2.toPast.ex[k2] = conj[k2].pastTense;
      }
      if (m2.fromPast) {
        m2.fromPast.ex[conj[k2].pastTense] = k2;
      }
    }
    if (conj[k2].presentTense) {
      if (m2.toPresent) {
        m2.toPresent.ex[k2] = conj[k2].presentTense;
      }
      if (m2.fromPresent) {
        m2.fromPresent.ex[conj[k2].presentTense] = k2;
      }
    }
    if (conj[k2].gerund) {
      if (m2.toGerund) {
        m2.toGerund.ex[k2] = conj[k2].gerund;
      }
      if (m2.fromGerund) {
        m2.fromGerund.ex[conj[k2].gerund] = k2;
      }
    }
    if (conj[k2].comparative) {
      if (m2.toComparative) {
        m2.toComparative.ex[k2] = conj[k2].comparative;
      }
      if (m2.fromComparative) {
        m2.fromComparative.ex[conj[k2].comparative] = k2;
      }
    }
    if (conj[k2].superlative) {
      if (m2.toSuperlative) {
        m2.toSuperlative.ex[k2] = conj[k2].superlative;
      }
      if (m2.fromSuperlative) {
        m2.fromSuperlative.ex[conj[k2].superlative] = k2;
      }
    }
  });
};
const extend = function(plugin2, world2, View2, nlp2) {
  const { methods: methods2, model: model2, compute: compute2, hooks: hooks2 } = world2;
  if (plugin2.methods) {
    mergeQuick(methods2, plugin2.methods);
  }
  if (plugin2.model) {
    mergeDeep(model2, plugin2.model);
  }
  if (plugin2.irregulars) {
    addIrregulars(model2, plugin2.irregulars);
  }
  if (plugin2.compute) {
    Object.assign(compute2, plugin2.compute);
  }
  if (hooks2) {
    world2.hooks = hooks2.concat(plugin2.hooks || []);
  }
  if (plugin2.api) {
    plugin2.api(View2);
  }
  if (plugin2.lib) {
    Object.keys(plugin2.lib).forEach((k2) => nlp2[k2] = plugin2.lib[k2]);
  }
  if (plugin2.tags) {
    nlp2.addTags(plugin2.tags);
  }
  if (plugin2.words) {
    nlp2.addWords(plugin2.words);
  }
  if (plugin2.mutate) {
    plugin2.mutate(world2);
  }
};
var extend$1 = extend;
const verbose = function(set) {
  const env2 = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
  env2.DEBUG_TAGS = set === "tagger" || set === true ? true : "";
  env2.DEBUG_MATCH = set === "match" || set === true ? true : "";
  env2.DEBUG_CHUNKS = set === "chunker" || set === true ? true : "";
  return this;
};
const isObject$5 = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
const isArray$8 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const fromJson = function(json2) {
  return json2.map((o2) => {
    return o2.terms.map((term) => {
      if (isArray$8(term.tags)) {
        term.tags = new Set(term.tags);
      }
      return term;
    });
  });
};
const preTokenized = function(arr) {
  return arr.map((a2) => {
    return a2.map((str) => {
      return {
        text: str,
        normal: str,
        pre: "",
        post: " ",
        tags: /* @__PURE__ */ new Set()
      };
    });
  });
};
const inputs = function(input, View2, world2) {
  const { methods: methods2 } = world2;
  let doc = new View2([]);
  doc.world = world2;
  if (typeof input === "number") {
    input = String(input);
  }
  if (!input) {
    return doc;
  }
  if (typeof input === "string") {
    let document2 = methods2.one.tokenize.fromString(input, world2);
    return new View2(document2);
  }
  if (isObject$5(input) && input.isView) {
    return new View2(input.document, input.ptrs);
  }
  if (isArray$8(input)) {
    if (isArray$8(input[0])) {
      let document3 = preTokenized(input);
      return new View2(document3);
    }
    let document2 = fromJson(input);
    return new View2(document2);
  }
  return doc;
};
var handleInputs = inputs;
let world = Object.assign({}, tmpWrld);
const nlp = function(input, lex) {
  if (lex) {
    nlp.addWords(lex);
  }
  let doc = handleInputs(input, View$1, world);
  if (input) {
    doc.compute(world.hooks);
  }
  return doc;
};
Object.defineProperty(nlp, "_world", {
  value: world,
  writable: true
});
nlp.tokenize = function(input, lex) {
  const { compute: compute2 } = this._world;
  if (lex) {
    nlp.addWords(lex);
  }
  let doc = handleInputs(input, View$1, world);
  if (compute2.contractions) {
    doc.compute(["alias", "normal", "machine", "contractions"]);
  }
  return doc;
};
nlp.plugin = function(plugin2) {
  extend$1(plugin2, this._world, View$1, this);
  return this;
};
nlp.extend = nlp.plugin;
nlp.world = function() {
  return this._world;
};
nlp.model = function() {
  return this._world.model;
};
nlp.methods = function() {
  return this._world.methods;
};
nlp.hooks = function() {
  return this._world.hooks;
};
nlp.verbose = verbose;
nlp.version = version;
var nlp$1 = nlp;
const createCache = function(document2) {
  let cache2 = document2.map((terms) => {
    let stuff = /* @__PURE__ */ new Set();
    terms.forEach((term) => {
      if (term.normal !== "") {
        stuff.add(term.normal);
      }
      if (term.switch) {
        stuff.add(`%${term.switch}%`);
      }
      if (term.implicit) {
        stuff.add(term.implicit);
      }
      if (term.machine) {
        stuff.add(term.machine);
      }
      if (term.root) {
        stuff.add(term.root);
      }
      if (term.alias) {
        term.alias.forEach((str) => stuff.add(str));
      }
      let tags2 = Array.from(term.tags);
      for (let t2 = 0; t2 < tags2.length; t2 += 1) {
        stuff.add("#" + tags2[t2]);
      }
    });
    return stuff;
  });
  return cache2;
};
var cacheDoc = createCache;
var methods$m = {
  one: {
    cacheDoc
  }
};
const methods$l = {
  cache: function() {
    this._cache = this.methods.one.cacheDoc(this.document);
    return this;
  },
  uncache: function() {
    this._cache = null;
    return this;
  }
};
const addAPI$3 = function(View2) {
  Object.assign(View2.prototype, methods$l);
};
var api$B = addAPI$3;
var compute$c = {
  cache: function(view) {
    view._cache = view.methods.one.cacheDoc(view.document);
  }
};
var cache$1 = {
  api: api$B,
  compute: compute$c,
  methods: methods$m
};
var caseFns = {
  toLowerCase: function() {
    this.termList().forEach((t2) => {
      t2.text = t2.text.toLowerCase();
    });
    return this;
  },
  toUpperCase: function() {
    this.termList().forEach((t2) => {
      t2.text = t2.text.toUpperCase();
    });
    return this;
  },
  toTitleCase: function() {
    this.termList().forEach((t2) => {
      t2.text = t2.text.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
    });
    return this;
  },
  toCamelCase: function() {
    this.docs.forEach((terms) => {
      terms.forEach((t2, i2) => {
        if (i2 !== 0) {
          t2.text = t2.text.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
        }
        if (i2 !== terms.length - 1) {
          t2.post = "";
        }
      });
    });
    return this;
  }
};
const isTitleCase$2 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str) || /^\p{Lu}$/u.test(str);
const toTitleCase$1 = (str) => str.replace(/^\p{Ll}/u, (x) => x.toUpperCase());
const toLowerCase = (str) => str.replace(/^\p{Lu}/u, (x) => x.toLowerCase());
const spliceArr = (parent, index2, child) => {
  child.forEach((term) => term.dirty = true);
  if (parent) {
    let args = [index2, 0].concat(child);
    Array.prototype.splice.apply(parent, args);
  }
  return parent;
};
const endSpace = function(terms) {
  const hasSpace2 = / $/;
  const hasDash2 = /[-–—]/;
  let lastTerm = terms[terms.length - 1];
  if (lastTerm && !hasSpace2.test(lastTerm.post) && !hasDash2.test(lastTerm.post)) {
    lastTerm.post += " ";
  }
};
const movePunct = (source, end2, needle) => {
  const juicy = /[-.?!,;:)–—'"]/g;
  let wasLast = source[end2 - 1];
  if (!wasLast) {
    return;
  }
  let post = wasLast.post;
  if (juicy.test(post)) {
    let punct = post.match(juicy).join("");
    let last = needle[needle.length - 1];
    last.post = punct + last.post;
    wasLast.post = wasLast.post.replace(juicy, "");
  }
};
const moveTitleCase = function(home, start2, needle) {
  let from = home[start2];
  if (start2 !== 0 || !isTitleCase$2(from.text)) {
    return;
  }
  needle[0].text = toTitleCase$1(needle[0].text);
  let old = home[start2];
  if (old.tags.has("ProperNoun") || old.tags.has("Acronym")) {
    return;
  }
  if (isTitleCase$2(old.text) && old.text.length > 1) {
    old.text = toLowerCase(old.text);
  }
};
const cleanPrepend = function(home, ptr, needle, document2) {
  let [n2, start2, end2] = ptr;
  if (start2 === 0) {
    endSpace(needle);
  } else if (end2 === document2[n2].length) {
    endSpace(needle);
  } else {
    endSpace(needle);
    endSpace([home[ptr[1]]]);
  }
  moveTitleCase(home, start2, needle);
  spliceArr(home, start2, needle);
};
const cleanAppend = function(home, ptr, needle, document2) {
  let [n2, , end2] = ptr;
  let total = (document2[n2] || []).length;
  if (end2 < total) {
    movePunct(home, end2, needle);
    endSpace(needle);
  } else if (total === end2) {
    endSpace(home);
    movePunct(home, end2, needle);
    if (document2[n2 + 1]) {
      needle[needle.length - 1].post += " ";
    }
  }
  spliceArr(home, ptr[2], needle);
  ptr[4] = needle[needle.length - 1].id;
};
let index$2 = 0;
const pad3 = (str) => {
  str = str.length < 3 ? "0" + str : str;
  return str.length < 3 ? "0" + str : str;
};
const toId = function(term) {
  let [n2, i2] = term.index || [0, 0];
  index$2 += 1;
  index$2 = index$2 > 46655 ? 0 : index$2;
  n2 = n2 > 46655 ? 0 : n2;
  i2 = i2 > 1294 ? 0 : i2;
  let id = pad3(index$2.toString(36));
  id += pad3(n2.toString(36));
  let tx = i2.toString(36);
  tx = tx.length < 2 ? "0" + tx : tx;
  id += tx;
  let r2 = parseInt(Math.random() * 36, 10);
  id += r2.toString(36);
  return term.normal + "|" + id.toUpperCase();
};
var uuid = toId;
const expand$3 = function(m2) {
  if (m2.has("@hasContraction") && typeof m2.contractions === "function") {
    let more = m2.grow("@hasContraction");
    more.contractions().expand();
  }
};
const isArray$7 = (arr) => Object.prototype.toString.call(arr) === "[object Array]";
const addIds$2 = function(terms) {
  terms = terms.map((term) => {
    term.id = uuid(term);
    return term;
  });
  return terms;
};
const getTerms = function(input, world2) {
  const { methods: methods2 } = world2;
  if (typeof input === "string") {
    return methods2.one.tokenize.fromString(input, world2)[0];
  }
  if (typeof input === "object" && input.isView) {
    return input.clone().docs[0] || [];
  }
  if (isArray$7(input)) {
    return isArray$7(input[0]) ? input[0] : input;
  }
  return [];
};
const insert = function(input, view, prepend) {
  const { document: document2, world: world2 } = view;
  view.uncache();
  let ptrs = view.fullPointer;
  let selfPtrs = view.fullPointer;
  view.forEach((m2, i2) => {
    let ptr = m2.fullPointer[0];
    let [n2] = ptr;
    let home = document2[n2];
    let terms = getTerms(input, world2);
    if (terms.length === 0) {
      return;
    }
    terms = addIds$2(terms);
    if (prepend) {
      expand$3(view.update([ptr]).firstTerm());
      cleanPrepend(home, ptr, terms, document2);
    } else {
      expand$3(view.update([ptr]).lastTerm());
      cleanAppend(home, ptr, terms, document2);
    }
    if (document2[n2] && document2[n2][ptr[1]]) {
      ptr[3] = document2[n2][ptr[1]].id;
    }
    selfPtrs[i2] = ptr;
    ptr[2] += terms.length;
    ptrs[i2] = ptr;
  });
  let doc = view.toView(ptrs);
  view.ptrs = selfPtrs;
  doc.compute(["id", "index", "lexicon"]);
  if (doc.world.compute.preTagger) {
    doc.compute("preTagger");
  }
  return doc;
};
const fns$4 = {
  insertAfter: function(input) {
    return insert(input, this, false);
  },
  insertBefore: function(input) {
    return insert(input, this, true);
  }
};
fns$4.append = fns$4.insertAfter;
fns$4.prepend = fns$4.insertBefore;
fns$4.insert = fns$4.insertAfter;
var insert$1 = fns$4;
const dollarStub = /\$[0-9a-z]+/g;
const fns$3 = {};
const titleCase$3 = function(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};
const replaceByFn = function(main, fn) {
  main.forEach((m2) => {
    let out2 = fn(m2);
    m2.replaceWith(out2);
  });
  return main;
};
const subDollarSign = function(input, main) {
  if (typeof input !== "string") {
    return input;
  }
  let groups = main.groups();
  input = input.replace(dollarStub, (a2) => {
    let num = a2.replace(/\$/, "");
    if (groups.hasOwnProperty(num)) {
      return groups[num].text();
    }
    return a2;
  });
  return input;
};
fns$3.replaceWith = function(input, keep2 = {}) {
  let ptrs = this.fullPointer;
  let main = this;
  this.uncache();
  if (typeof input === "function") {
    return replaceByFn(main, input);
  }
  let terms = main.docs[0];
  let isPossessive2 = keep2.possessives && terms[terms.length - 1].tags.has("Possessive");
  input = subDollarSign(input, main);
  let original = this.update(ptrs);
  ptrs = ptrs.map((ptr) => ptr.slice(0, 3));
  let oldTags = (original.docs[0] || []).map((term) => Array.from(term.tags));
  if (typeof input === "string") {
    input = this.fromText(input).compute("id");
  }
  main.insertAfter(input);
  if (original.has("@hasContraction") && main.contractions) {
    let more = main.grow("@hasContraction+");
    more.contractions().expand();
  }
  main.delete(original);
  if (isPossessive2) {
    let tmp = main.docs[0];
    let term = tmp[tmp.length - 1];
    if (!term.tags.has("Possessive")) {
      term.text += "'s";
      term.normal += "'s";
      term.tags.add("Possessive");
    }
  }
  let m2 = main.toView(ptrs).compute(["index", "lexicon"]);
  if (m2.world.compute.preTagger) {
    m2.compute("preTagger");
  }
  if (keep2.tags) {
    m2.terms().forEach((term, i2) => {
      term.tagSafe(oldTags[i2]);
    });
  }
  if (keep2.case && m2.docs[0] && m2.docs[0][0] && m2.docs[0][0].index[1] === 0) {
    m2.docs[0][0].text = titleCase$3(m2.docs[0][0].text);
  }
  return m2;
};
fns$3.replace = function(match2, input, keep2) {
  if (match2 && !input) {
    return this.replaceWith(match2, keep2);
  }
  let m2 = this.match(match2);
  if (!m2.found) {
    return this;
  }
  this.soften();
  return m2.replaceWith(input, keep2);
};
var replace = fns$3;
const repairPunct = function(terms, len) {
  let last = terms.length - 1;
  let from = terms[last];
  let to = terms[last - len];
  if (to && from) {
    to.post += from.post;
    to.post = to.post.replace(/ +([.?!,;:])/, "$1");
    to.post = to.post.replace(/[,;:]+([.?!])/, "$1");
  }
};
const pluckOut = function(document2, nots) {
  nots.forEach((ptr) => {
    let [n2, start2, end2] = ptr;
    let len = end2 - start2;
    if (!document2[n2]) {
      return;
    }
    if (end2 === document2[n2].length && end2 > 1) {
      repairPunct(document2[n2], len);
    }
    document2[n2].splice(start2, len);
  });
  for (let i2 = document2.length - 1; i2 >= 0; i2 -= 1) {
    if (document2[i2].length === 0) {
      document2.splice(i2, 1);
      if (i2 === document2.length && document2[i2 - 1]) {
        let terms = document2[i2 - 1];
        let lastTerm = terms[terms.length - 1];
        if (lastTerm) {
          lastTerm.post = lastTerm.post.trimEnd();
        }
      }
    }
  }
  return document2;
};
var pluckOutTerm = pluckOut;
const fixPointers$1 = function(ptrs, gonePtrs) {
  ptrs = ptrs.map((ptr) => {
    let [n2] = ptr;
    if (!gonePtrs[n2]) {
      return ptr;
    }
    gonePtrs[n2].forEach((no) => {
      let len = no[2] - no[1];
      if (ptr[1] <= no[1] && ptr[2] >= no[2]) {
        ptr[2] -= len;
      }
    });
    return ptr;
  });
  ptrs.forEach((ptr, i2) => {
    if (ptr[1] === 0 && ptr[2] == 0) {
      for (let n2 = i2 + 1; n2 < ptrs.length; n2 += 1) {
        ptrs[n2][0] -= 1;
        if (ptrs[n2][0] < 0) {
          ptrs[n2][0] = 0;
        }
      }
    }
  });
  ptrs = ptrs.filter((ptr) => ptr[2] - ptr[1] > 0);
  ptrs = ptrs.map((ptr) => {
    ptr[3] = null;
    ptr[4] = null;
    return ptr;
  });
  return ptrs;
};
const methods$k = {
  remove: function(reg) {
    const { indexN: indexN2 } = this.methods.one.pointer;
    this.uncache();
    let self2 = this.all();
    let not = this;
    if (reg) {
      self2 = this;
      not = this.match(reg);
    }
    let isFull = !self2.ptrs;
    if (not.has("@hasContraction") && not.contractions) {
      let more = not.grow("@hasContraction");
      more.contractions().expand();
    }
    let ptrs = self2.fullPointer;
    let nots = not.fullPointer.reverse();
    let document2 = pluckOutTerm(this.document, nots);
    let gonePtrs = indexN2(nots);
    ptrs = fixPointers$1(ptrs, gonePtrs);
    self2.ptrs = ptrs;
    self2.document = document2;
    self2.compute("index");
    if (isFull) {
      self2.ptrs = void 0;
    }
    if (!reg) {
      this.ptrs = [];
      return self2.none();
    }
    let res = self2.toView(ptrs);
    return res;
  }
};
methods$k.delete = methods$k.remove;
var remove = methods$k;
const methods$j = {
  pre: function(str, concat2) {
    if (str === void 0 && this.found) {
      return this.docs[0][0].pre;
    }
    this.docs.forEach((terms) => {
      let term = terms[0];
      if (concat2 === true) {
        term.pre += str;
      } else {
        term.pre = str;
      }
    });
    return this;
  },
  post: function(str, concat2) {
    if (str === void 0) {
      let last = this.docs[this.docs.length - 1];
      return last[last.length - 1].post;
    }
    this.docs.forEach((terms) => {
      let term = terms[terms.length - 1];
      if (concat2 === true) {
        term.post += str;
      } else {
        term.post = str;
      }
    });
    return this;
  },
  trim: function() {
    if (!this.found) {
      return this;
    }
    let docs = this.docs;
    let start2 = docs[0][0];
    start2.pre = start2.pre.trimStart();
    let last = docs[docs.length - 1];
    let end2 = last[last.length - 1];
    end2.post = end2.post.trimEnd();
    return this;
  },
  hyphenate: function() {
    this.docs.forEach((terms) => {
      terms.forEach((t2, i2) => {
        if (i2 !== 0) {
          t2.pre = "";
        }
        if (terms[i2 + 1]) {
          t2.post = "-";
        }
      });
    });
    return this;
  },
  dehyphenate: function() {
    const hasHyphen2 = /[-–—]/;
    this.docs.forEach((terms) => {
      terms.forEach((t2) => {
        if (hasHyphen2.test(t2.post)) {
          t2.post = " ";
        }
      });
    });
    return this;
  },
  toQuotations: function(start2, end2) {
    start2 = start2 || `"`;
    end2 = end2 || `"`;
    this.docs.forEach((terms) => {
      terms[0].pre = start2 + terms[0].pre;
      let last = terms[terms.length - 1];
      last.post = end2 + last.post;
    });
    return this;
  },
  toParentheses: function(start2, end2) {
    start2 = start2 || `(`;
    end2 = end2 || `)`;
    this.docs.forEach((terms) => {
      terms[0].pre = start2 + terms[0].pre;
      let last = terms[terms.length - 1];
      last.post = end2 + last.post;
    });
    return this;
  }
};
methods$j.deHyphenate = methods$j.dehyphenate;
methods$j.toQuotation = methods$j.toQuotations;
var whitespace = methods$j;
const alpha = (a2, b) => {
  if (a2.normal < b.normal) {
    return -1;
  }
  if (a2.normal > b.normal) {
    return 1;
  }
  return 0;
};
const length = (a2, b) => {
  let left = a2.normal.trim().length;
  let right = b.normal.trim().length;
  if (left < right) {
    return 1;
  }
  if (left > right) {
    return -1;
  }
  return 0;
};
const wordCount$2 = (a2, b) => {
  if (a2.words < b.words) {
    return 1;
  }
  if (a2.words > b.words) {
    return -1;
  }
  return 0;
};
const sequential = (a2, b) => {
  if (a2[0] < b[0]) {
    return 1;
  }
  if (a2[0] > b[0]) {
    return -1;
  }
  return a2[1] > b[1] ? 1 : -1;
};
const byFreq = function(arr) {
  let counts = {};
  arr.forEach((o2) => {
    counts[o2.normal] = counts[o2.normal] || 0;
    counts[o2.normal] += 1;
  });
  arr.sort((a2, b) => {
    let left = counts[a2.normal];
    let right = counts[b.normal];
    if (left < right) {
      return 1;
    }
    if (left > right) {
      return -1;
    }
    return 0;
  });
  return arr;
};
var methods$i = { alpha, length, wordCount: wordCount$2, sequential, byFreq };
const seqNames = /* @__PURE__ */ new Set(["index", "sequence", "seq", "sequential", "chron", "chronological"]);
const freqNames = /* @__PURE__ */ new Set(["freq", "frequency", "topk", "repeats"]);
const alphaNames = /* @__PURE__ */ new Set(["alpha", "alphabetical"]);
const customSort = function(view, fn) {
  let ptrs = view.fullPointer;
  ptrs = ptrs.sort((a2, b) => {
    a2 = view.update([a2]);
    b = view.update([b]);
    return fn(a2, b);
  });
  view.ptrs = ptrs;
  return view;
};
const sort = function(input) {
  let { docs, pointer } = this;
  this.uncache();
  if (typeof input === "function") {
    return customSort(this, input);
  }
  input = input || "alpha";
  let ptrs = pointer || docs.map((_d, n2) => [n2]);
  let arr = docs.map((terms, n2) => {
    return {
      index: n2,
      words: terms.length,
      normal: terms.map((t2) => t2.machine || t2.normal || "").join(" "),
      pointer: ptrs[n2]
    };
  });
  if (seqNames.has(input)) {
    input = "sequential";
  }
  if (alphaNames.has(input)) {
    input = "alpha";
  }
  if (freqNames.has(input)) {
    arr = methods$i.byFreq(arr);
    return this.update(arr.map((o2) => o2.pointer));
  }
  if (typeof methods$i[input] === "function") {
    arr = arr.sort(methods$i[input]);
    return this.update(arr.map((o2) => o2.pointer));
  }
  return this;
};
const reverse$2 = function() {
  let ptrs = this.pointer || this.docs.map((_d, n2) => [n2]);
  ptrs = [].concat(ptrs);
  ptrs = ptrs.reverse();
  if (this._cache) {
    this._cache = this._cache.reverse();
  }
  return this.update(ptrs);
};
const unique = function() {
  let already = /* @__PURE__ */ new Set();
  let res = this.filter((m2) => {
    let txt = m2.text("machine");
    if (already.has(txt)) {
      return false;
    }
    already.add(txt);
    return true;
  });
  return res;
};
var sort$1 = { unique, reverse: reverse$2, sort };
const isArray$6 = (arr) => Object.prototype.toString.call(arr) === "[object Array]";
const combineDocs = function(homeDocs, inputDocs) {
  if (homeDocs.length > 0) {
    let end2 = homeDocs[homeDocs.length - 1];
    let last = end2[end2.length - 1];
    if (/ /.test(last.post) === false) {
      last.post += " ";
    }
  }
  homeDocs = homeDocs.concat(inputDocs);
  return homeDocs;
};
const combineViews = function(home, input) {
  if (home.document === input.document) {
    let ptrs2 = home.fullPointer.concat(input.fullPointer);
    return home.toView(ptrs2).compute("index");
  }
  let ptrs = input.fullPointer;
  ptrs.forEach((a2) => {
    a2[0] += home.document.length;
  });
  home.document = combineDocs(home.document, input.docs);
  return home.all();
};
var concat = {
  concat: function(input) {
    if (typeof input === "string") {
      let more = this.fromText(input);
      if (!this.found || !this.ptrs) {
        this.document = this.document.concat(more.document);
      } else {
        let ptrs = this.fullPointer;
        let at = ptrs[ptrs.length - 1][0];
        this.document.splice(at, 0, ...more.document);
      }
      return this.all().compute("index");
    }
    if (typeof input === "object" && input.isView) {
      return combineViews(this, input);
    }
    if (isArray$6(input)) {
      let docs = combineDocs(this.document, input);
      this.document = docs;
      return this.all();
    }
    return this;
  }
};
const harden = function() {
  this.ptrs = this.fullPointer;
  return this;
};
const soften = function() {
  let ptr = this.ptrs;
  if (!ptr || ptr.length < 1) {
    return this;
  }
  ptr = ptr.map((a2) => a2.slice(0, 3));
  this.ptrs = ptr;
  return this;
};
var harden$1 = { harden, soften };
const methods$h = Object.assign({}, caseFns, insert$1, replace, remove, whitespace, sort$1, concat, harden$1);
const addAPI$2 = function(View2) {
  Object.assign(View2.prototype, methods$h);
};
var api$A = addAPI$2;
const compute$a = {
  id: function(view) {
    let docs = view.docs;
    for (let n2 = 0; n2 < docs.length; n2 += 1) {
      for (let i2 = 0; i2 < docs[n2].length; i2 += 1) {
        let term = docs[n2][i2];
        term.id = term.id || uuid(term);
      }
    }
  }
};
var compute$b = compute$a;
var change = {
  api: api$A,
  compute: compute$b
};
var contractions$3 = [
  { word: "@", out: ["at"] },
  { word: "arent", out: ["are", "not"] },
  { word: "alot", out: ["a", "lot"] },
  { word: "brb", out: ["be", "right", "back"] },
  { word: "cannot", out: ["can", "not"] },
  { word: "dun", out: ["do", "not"] },
  { word: "can't", out: ["can", "not"] },
  { word: "shan't", out: ["should", "not"] },
  { word: "won't", out: ["will", "not"] },
  { word: "that's", out: ["that", "is"] },
  { word: "what's", out: ["what", "is"] },
  { word: "let's", out: ["let", "us"] },
  { word: "dunno", out: ["do", "not", "know"] },
  { word: "gonna", out: ["going", "to"] },
  { word: "gotta", out: ["have", "got", "to"] },
  { word: "gimme", out: ["give", "me"] },
  { word: "outta", out: ["out", "of"] },
  { word: "tryna", out: ["trying", "to"] },
  { word: "gtg", out: ["got", "to", "go"] },
  { word: "im", out: ["i", "am"] },
  { word: "imma", out: ["I", "will"] },
  { word: "imo", out: ["in", "my", "opinion"] },
  { word: "irl", out: ["in", "real", "life"] },
  { word: "ive", out: ["i", "have"] },
  { word: "rn", out: ["right", "now"] },
  { word: "tbh", out: ["to", "be", "honest"] },
  { word: "wanna", out: ["want", "to"] },
  { word: `c'mere`, out: ["come", "here"] },
  { word: `c'mon`, out: ["come", "on"] },
  { word: "shoulda", out: ["should", "have"] },
  { word: "coulda", out: ["coulda", "have"] },
  { word: "woulda", out: ["woulda", "have"] },
  { word: "musta", out: ["must", "have"] },
  { word: "tis", out: ["it", "is"] },
  { word: "twas", out: ["it", "was"] },
  { word: `y'know`, out: ["you", "know"] },
  { word: "ne'er", out: ["never"] },
  { word: "o'er", out: ["over"] },
  { after: "ll", out: ["will"] },
  { after: "ve", out: ["have"] },
  { after: "re", out: ["are"] },
  { after: "m", out: ["am"] },
  { before: "c", out: ["ce"] },
  { before: "m", out: ["me"] },
  { before: "n", out: ["ne"] },
  { before: "qu", out: ["que"] },
  { before: "s", out: ["se"] },
  { before: "t", out: ["tu"] },
  { word: "shouldnt", out: ["should", "not"] },
  { word: "couldnt", out: ["could", "not"] },
  { word: "wouldnt", out: ["would", "not"] },
  { word: "hasnt", out: ["has", "not"] },
  { word: "wasnt", out: ["was", "not"] },
  { word: "isnt", out: ["is", "not"] },
  { word: "cant", out: ["can", "not"] },
  { word: "dont", out: ["do", "not"] },
  { word: "wont", out: ["will", "not"] },
  { word: "howd", out: ["how", "did"] },
  { word: "whatd", out: ["what", "did"] },
  { word: "whend", out: ["when", "did"] },
  { word: "whered", out: ["where", "did"] }
];
const t$1 = true;
var numberSuffixes = {
  "st": t$1,
  "nd": t$1,
  "rd": t$1,
  "th": t$1,
  "am": t$1,
  "pm": t$1,
  "max": t$1,
  "\xB0": t$1,
  "s": t$1,
  "e": t$1,
  "er": t$1,
  "\xE8re": t$1,
  "\xE8me": t$1
};
var model$6 = {
  one: {
    contractions: contractions$3,
    numberSuffixes
  }
};
const insertContraction$1 = function(document2, point, words2) {
  let [n2, w] = point;
  if (!words2 || words2.length === 0) {
    return;
  }
  words2 = words2.map((word, i2) => {
    word.implicit = word.text;
    word.machine = word.text;
    word.pre = "";
    word.post = "";
    word.text = "";
    word.normal = "";
    word.index = [n2, w + i2];
    return word;
  });
  if (words2[0]) {
    words2[0].pre = document2[n2][w].pre;
    words2[words2.length - 1].post = document2[n2][w].post;
    words2[0].text = document2[n2][w].text;
    words2[0].normal = document2[n2][w].normal;
  }
  document2[n2].splice(w, 1, ...words2);
};
var splice$1 = insertContraction$1;
const hasContraction$3 = /'/;
const alwaysDid = /* @__PURE__ */ new Set([
  "what",
  "how",
  "when",
  "where",
  "why"
]);
const useWould = /* @__PURE__ */ new Set([
  "be",
  "go",
  "start",
  "think",
  "need"
]);
const useHad = /* @__PURE__ */ new Set([
  "been",
  "gone"
]);
const _apostropheD$1 = function(terms, i2) {
  let before2 = terms[i2].normal.split(hasContraction$3)[0];
  if (alwaysDid.has(before2)) {
    return [before2, "did"];
  }
  if (terms[i2 + 1]) {
    if (useHad.has(terms[i2 + 1].normal)) {
      return [before2, "had"];
    }
    if (useWould.has(terms[i2 + 1].normal)) {
      return [before2, "would"];
    }
  }
  return null;
};
var apostropheD$1 = _apostropheD$1;
const apostropheT$2 = function(terms, i2) {
  if (terms[i2].normal === "ain't" || terms[i2].normal === "aint") {
    return null;
  }
  let before2 = terms[i2].normal.replace(/n't/, "");
  return [before2, "not"];
};
var apostropheT$3 = apostropheT$2;
const hasContraction$2 = /'/;
const preL = (terms, i2) => {
  let after2 = terms[i2].normal.split(hasContraction$2)[1];
  if (after2 && after2.endsWith("e")) {
    return ["la", after2];
  }
  return ["le", after2];
};
const preD = (terms, i2) => {
  let after2 = terms[i2].normal.split(hasContraction$2)[1];
  if (after2 && after2.endsWith("e")) {
    return ["du", after2];
  } else if (after2 && after2.endsWith("s")) {
    return ["des", after2];
  }
  return ["de", after2];
};
const preJ = (terms, i2) => {
  let after2 = terms[i2].normal.split(hasContraction$2)[1];
  return ["je", after2];
};
var french = {
  preJ,
  preL,
  preD
};
const isRange = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i;
const timeRange = /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i;
const phoneNum = /^[0-9]{3}-[0-9]{4}$/;
const numberRange = function(terms, i2) {
  let term = terms[i2];
  let parts = term.text.match(isRange);
  if (parts !== null) {
    if (term.tags.has("PhoneNumber") === true || phoneNum.test(term.text)) {
      return null;
    }
    return [parts[1], "to", parts[2]];
  } else {
    parts = term.text.match(timeRange);
    if (parts !== null) {
      return [parts[1], "to", parts[4]];
    }
  }
  return null;
};
var numberRange$1 = numberRange;
const numUnit = /^([+-]?[0-9][.,0-9]*)([a-z°²³µ/]+)$/;
const numberUnit = function(terms, i2, world2) {
  const notUnit = world2.model.one.numberSuffixes || {};
  let term = terms[i2];
  let parts = term.text.match(numUnit);
  if (parts !== null) {
    let unit = parts[2].toLowerCase().trim();
    if (notUnit.hasOwnProperty(unit)) {
      return null;
    }
    return [parts[1], unit];
  }
  return null;
};
var numberUnit$1 = numberUnit;
const byApostrophe$1 = /'/;
const numDash = /^[0-9][^-–—]*[-–—].*?[0-9]/;
const reTag$1 = function(terms, view, start2, len) {
  let tmp = view.update();
  tmp.document = [terms];
  let end2 = start2 + len;
  if (start2 > 0) {
    start2 -= 1;
  }
  if (terms[end2]) {
    end2 += 1;
  }
  tmp.ptrs = [[0, start2, end2]];
};
const byEnd$1 = {
  t: (terms, i2) => apostropheT$3(terms, i2),
  d: (terms, i2) => apostropheD$1(terms, i2)
};
const byStart = {
  j: (terms, i2) => french.preJ(terms, i2),
  l: (terms, i2) => french.preL(terms, i2),
  d: (terms, i2) => french.preD(terms, i2)
};
const knownOnes = function(list2, term, before2, after2) {
  for (let i2 = 0; i2 < list2.length; i2 += 1) {
    let o2 = list2[i2];
    if (o2.word === term.normal) {
      return o2.out;
    } else if (after2 !== null && after2 === o2.after) {
      return [before2].concat(o2.out);
    } else if (before2 !== null && before2 === o2.before && after2 && after2.length > 2) {
      return o2.out.concat(after2);
    }
  }
  return null;
};
const toDocs$1 = function(words2, view) {
  let doc = view.fromText(words2.join(" "));
  doc.compute(["id", "alias"]);
  return doc.docs[0];
};
const thereHas = function(terms, i2) {
  for (let k2 = i2 + 1; k2 < 5; k2 += 1) {
    if (!terms[k2]) {
      break;
    }
    if (terms[k2].normal === "been") {
      return ["there", "has"];
    }
  }
  return ["there", "is"];
};
const contractions$1 = (view) => {
  let { world: world2, document: document2 } = view;
  const { model: model2, methods: methods2 } = world2;
  let list2 = model2.one.contractions || [];
  document2.forEach((terms, n2) => {
    for (let i2 = terms.length - 1; i2 >= 0; i2 -= 1) {
      let before2 = null;
      let after2 = null;
      if (byApostrophe$1.test(terms[i2].normal) === true) {
        [before2, after2] = terms[i2].normal.split(byApostrophe$1);
      }
      let words2 = knownOnes(list2, terms[i2], before2, after2);
      if (!words2 && byEnd$1.hasOwnProperty(after2)) {
        words2 = byEnd$1[after2](terms, i2, world2);
      }
      if (!words2 && byStart.hasOwnProperty(before2)) {
        words2 = byStart[before2](terms, i2);
      }
      if (before2 === "there" && after2 === "s") {
        words2 = thereHas(terms, i2);
      }
      if (words2) {
        words2 = toDocs$1(words2, view);
        splice$1(document2, [n2, i2], words2);
        reTag$1(document2[n2], view, i2, words2.length);
        continue;
      }
      if (numDash.test(terms[i2].normal)) {
        words2 = numberRange$1(terms, i2);
        if (words2) {
          words2 = toDocs$1(words2, view);
          splice$1(document2, [n2, i2], words2);
          methods2.one.setTag(words2, "NumberRange", world2);
          if (words2[2] && words2[2].tags.has("Time")) {
            methods2.one.setTag([words2[0]], "Time", world2, null, "time-range");
          }
          reTag$1(document2[n2], view, i2, words2.length);
        }
        continue;
      }
      words2 = numberUnit$1(terms, i2, world2);
      if (words2) {
        words2 = toDocs$1(words2, view);
        splice$1(document2, [n2, i2], words2);
        methods2.one.setTag([words2[1]], "Unit", world2, null, "contraction-unit");
      }
    }
  });
};
var contractions$2 = contractions$1;
var compute$9 = { contractions: contractions$2 };
const plugin$3 = {
  model: model$6,
  compute: compute$9,
  hooks: ["contractions"]
};
var contractions = plugin$3;
const checkMulti = function(terms, i2, lexicon2, setTag2, world2) {
  let max2 = i2 + 4 > terms.length ? terms.length - i2 : 4;
  let str = terms[i2].machine || terms[i2].normal;
  for (let skip = 1; skip < max2; skip += 1) {
    let t2 = terms[i2 + skip];
    let word = t2.machine || t2.normal;
    str += " " + word;
    if (lexicon2.hasOwnProperty(str) === true) {
      let tag2 = lexicon2[str];
      let ts = terms.slice(i2, i2 + skip + 1);
      setTag2(ts, tag2, world2, false, "1-multi-lexicon");
      if (tag2 && tag2.length === 2 && (tag2[0] === "PhrasalVerb" || tag2[1] === "PhrasalVerb")) {
        setTag2([ts[1]], "Particle", world2, false, "1-phrasal-particle");
      }
      return true;
    }
  }
  return false;
};
const multiWord = function(terms, i2, world2) {
  const { model: model2, methods: methods2 } = world2;
  const setTag2 = methods2.one.setTag;
  const multi = model2.one._multiCache || {};
  const lexicon2 = model2.one.lexicon || {};
  let t2 = terms[i2];
  let word = t2.machine || t2.normal;
  if (terms[i2 + 1] !== void 0 && multi[word] === true) {
    return checkMulti(terms, i2, lexicon2, setTag2, world2);
  }
  return null;
};
var multiWord$1 = multiWord;
const prefix$3 = /^(under|over|mis|re|un|dis|semi|pre|post)-?/;
const allowPrefix = /* @__PURE__ */ new Set(["Verb", "Infinitive", "PastTense", "Gerund", "PresentTense", "Adjective", "Participle"]);
const checkLexicon = function(terms, i2, world2) {
  const { model: model2, methods: methods2 } = world2;
  const setTag2 = methods2.one.setTag;
  const lexicon2 = model2.one.lexicon;
  let t2 = terms[i2];
  let word = t2.machine || t2.normal;
  if (lexicon2[word] !== void 0 && lexicon2.hasOwnProperty(word)) {
    let tag2 = lexicon2[word];
    setTag2([t2], tag2, world2, false, "1-lexicon");
    return true;
  }
  if (t2.alias) {
    let found = t2.alias.find((str) => lexicon2.hasOwnProperty(str));
    if (found) {
      let tag2 = lexicon2[found];
      setTag2([t2], tag2, world2, false, "1-lexicon-alias");
      return true;
    }
  }
  if (prefix$3.test(word) === true) {
    let stem = word.replace(prefix$3, "");
    if (lexicon2.hasOwnProperty(stem) && stem.length > 3) {
      if (allowPrefix.has(lexicon2[stem])) {
        setTag2([t2], lexicon2[stem], world2, false, "1-lexicon-prefix");
        return true;
      }
    }
  }
  return null;
};
var singleWord = checkLexicon;
const lexicon$3 = function(view) {
  const world2 = view.world;
  view.docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      if (terms[i2].tags.size === 0) {
        let found = null;
        found = found || multiWord$1(terms, i2, world2);
        found = found || singleWord(terms, i2, world2);
      }
    }
  });
};
var compute$8 = {
  lexicon: lexicon$3
};
const expand$2 = function(words2) {
  let lex = {};
  let _multi = {};
  Object.keys(words2).forEach((word) => {
    let tag2 = words2[word];
    word = word.toLowerCase().trim();
    word = word.replace(/'s\b/, "");
    let split2 = word.split(/ /);
    if (split2.length > 1) {
      _multi[split2[0]] = true;
    }
    lex[word] = lex[word] || tag2;
  });
  delete lex[""];
  delete lex[null];
  delete lex[" "];
  return { lex, _multi };
};
var expandLexicon$3 = expand$2;
var methods$g = {
  one: {
    expandLexicon: expandLexicon$3
  }
};
const addWords = function(words2) {
  const world2 = this.world();
  const { methods: methods2, model: model2 } = world2;
  if (!words2) {
    return;
  }
  Object.keys(words2).forEach((k2) => {
    if (typeof words2[k2] === "string" && words2[k2].startsWith("#")) {
      words2[k2] = words2[k2].replace(/^#/, "");
    }
  });
  if (methods2.two.expandLexicon) {
    let { lex, _multi } = methods2.two.expandLexicon(words2, world2);
    Object.assign(model2.one.lexicon, lex);
    Object.assign(model2.one._multiCache, _multi);
  } else if (methods2.one.expandLexicon) {
    let { lex, _multi } = methods2.one.expandLexicon(words2, world2);
    Object.assign(model2.one.lexicon, lex);
    Object.assign(model2.one._multiCache, _multi);
  } else {
    Object.assign(model2.one.lexicon, words2);
  }
};
var lib$5 = { addWords };
const model$5 = {
  one: {
    lexicon: {},
    _multiCache: {}
  }
};
var lexicon$2 = {
  model: model$5,
  methods: methods$g,
  compute: compute$8,
  lib: lib$5,
  hooks: ["lexicon"]
};
const tokenize$2 = function(phrase, world2) {
  const { methods: methods2, model: model2 } = world2;
  let terms = methods2.one.tokenize.splitTerms(phrase, model2).map((t2) => methods2.one.tokenize.splitWhitespace(t2, model2));
  return terms.map((term) => term.text.toLowerCase());
};
const buildTrie = function(phrases, world2) {
  let goNext = [{}];
  let endAs = [null];
  let failTo = [0];
  let xs = [];
  let n2 = 0;
  phrases.forEach(function(phrase) {
    let curr = 0;
    let words2 = tokenize$2(phrase, world2);
    for (let i2 = 0; i2 < words2.length; i2++) {
      let word = words2[i2];
      if (goNext[curr] && goNext[curr].hasOwnProperty(word)) {
        curr = goNext[curr][word];
      } else {
        n2++;
        goNext[curr][word] = n2;
        goNext[n2] = {};
        curr = n2;
        endAs[n2] = null;
      }
    }
    endAs[curr] = [words2.length];
  });
  for (let word in goNext[0]) {
    n2 = goNext[0][word];
    failTo[n2] = 0;
    xs.push(n2);
  }
  while (xs.length) {
    let r2 = xs.shift();
    let keys = Object.keys(goNext[r2]);
    for (let i2 = 0; i2 < keys.length; i2 += 1) {
      let word = keys[i2];
      let s2 = goNext[r2][word];
      xs.push(s2);
      n2 = failTo[r2];
      while (n2 > 0 && !goNext[n2].hasOwnProperty(word)) {
        n2 = failTo[n2];
      }
      if (goNext.hasOwnProperty(n2)) {
        let fs = goNext[n2][word];
        failTo[s2] = fs;
        if (endAs[fs]) {
          endAs[s2] = endAs[s2] || [];
          endAs[s2] = endAs[s2].concat(endAs[fs]);
        }
      } else {
        failTo[s2] = 0;
      }
    }
  }
  return { goNext, endAs, failTo };
};
var build = buildTrie;
const scanWords = function(terms, trie, opts2) {
  let n2 = 0;
  let results = [];
  for (let i2 = 0; i2 < terms.length; i2++) {
    let word = terms[i2][opts2.form] || terms[i2].normal;
    while (n2 > 0 && (trie.goNext[n2] === void 0 || !trie.goNext[n2].hasOwnProperty(word))) {
      n2 = trie.failTo[n2] || 0;
    }
    if (!trie.goNext[n2].hasOwnProperty(word)) {
      continue;
    }
    n2 = trie.goNext[n2][word];
    if (trie.endAs[n2]) {
      let arr = trie.endAs[n2];
      for (let o2 = 0; o2 < arr.length; o2++) {
        let len = arr[o2];
        let term = terms[i2 - len + 1];
        let [no, start2] = term.index;
        results.push([no, start2, start2 + len, term.id]);
      }
    }
  }
  return results;
};
const cacheMiss = function(words2, cache2) {
  for (let i2 = 0; i2 < words2.length; i2 += 1) {
    if (cache2.has(words2[i2]) === true) {
      return false;
    }
  }
  return true;
};
const scan = function(view, trie, opts2) {
  let results = [];
  opts2.form = opts2.form || "normal";
  let docs = view.docs;
  if (!trie.goNext || !trie.goNext[0]) {
    console.error("Compromise invalid lookup trie");
    return view.none();
  }
  let firstWords = Object.keys(trie.goNext[0]);
  for (let i2 = 0; i2 < docs.length; i2++) {
    if (view._cache && view._cache[i2] && cacheMiss(firstWords, view._cache[i2]) === true) {
      continue;
    }
    let terms = docs[i2];
    let found = scanWords(terms, trie, opts2);
    if (found.length > 0) {
      results = results.concat(found);
    }
  }
  return view.update(results);
};
var scan$1 = scan;
const isObject$4 = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
function api$z(View2) {
  View2.prototype.lookup = function(input, opts2 = {}) {
    if (!input) {
      return this.none();
    }
    if (typeof input === "string") {
      input = [input];
    }
    let trie = isObject$4(input) ? input : build(input, this.world);
    let res = scan$1(this, trie, opts2);
    res = res.settle();
    return res;
  };
}
const truncate = (list2, val) => {
  for (let i2 = list2.length - 1; i2 >= 0; i2 -= 1) {
    if (list2[i2] !== val) {
      list2 = list2.slice(0, i2 + 1);
      return list2;
    }
  }
  return list2;
};
const compress = function(trie) {
  trie.goNext = trie.goNext.map((o2) => {
    if (Object.keys(o2).length === 0) {
      return void 0;
    }
    return o2;
  });
  trie.goNext = truncate(trie.goNext, void 0);
  trie.failTo = truncate(trie.failTo, 0);
  trie.endAs = truncate(trie.endAs, null);
  return trie;
};
var compress$1 = compress;
const lib$4 = {
  buildTrie: function(input) {
    const trie = build(input, this.world());
    return compress$1(trie);
  }
};
lib$4.compile = lib$4.buildTrie;
var lookup = {
  api: api$z,
  lib: lib$4
};
const relPointer = function(ptrs, parent) {
  if (!parent) {
    return ptrs;
  }
  ptrs.forEach((ptr) => {
    let n2 = ptr[0];
    if (parent[n2]) {
      ptr[0] = parent[n2][0];
      ptr[1] += parent[n2][1];
      ptr[2] += parent[n2][1];
    }
  });
  return ptrs;
};
const fixPointers = function(res, parent) {
  let { ptrs, byGroup } = res;
  ptrs = relPointer(ptrs, parent);
  Object.keys(byGroup).forEach((k2) => {
    byGroup[k2] = relPointer(byGroup[k2], parent);
  });
  return { ptrs, byGroup };
};
const isObject$3 = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
const isView = (val) => val && isObject$3(val) && val.isView === true;
const isNet = (val) => val && isObject$3(val) && val.isNet === true;
const parseRegs = function(regs, opts2, world2) {
  const one = world2.methods.one;
  if (typeof regs === "number") {
    regs = String(regs);
  }
  if (typeof regs === "string") {
    regs = one.killUnicode(regs, world2);
    regs = one.parseMatch(regs, opts2, world2);
  }
  return regs;
};
const match$2 = function(regs, group, opts2) {
  const one = this.methods.one;
  if (isView(regs)) {
    return this.intersection(regs);
  }
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false }).view.settle();
  }
  regs = parseRegs(regs, opts2, this.world);
  let todo = { regs, group };
  let res = one.match(this.docs, todo, this._cache);
  let { ptrs, byGroup } = fixPointers(res, this.fullPointer);
  let view = this.toView(ptrs);
  view._groups = byGroup;
  return view;
};
const matchOne = function(regs, group, opts2) {
  const one = this.methods.one;
  if (isView(regs)) {
    return this.intersection(regs).eq(0);
  }
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false, matchOne: true }).view;
  }
  regs = parseRegs(regs, opts2, this.world);
  let todo = { regs, group, justOne: true };
  let res = one.match(this.docs, todo, this._cache);
  let { ptrs, byGroup } = fixPointers(res, this.fullPointer);
  let view = this.toView(ptrs);
  view._groups = byGroup;
  return view;
};
const has = function(regs, group, opts2) {
  const one = this.methods.one;
  if (isView(regs)) {
    let ptrs2 = regs.fullPointer;
    return ptrs2.length > 0;
  }
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false }).view.found;
  }
  regs = parseRegs(regs, opts2, this.world);
  let todo = { regs, group, justOne: true };
  let ptrs = one.match(this.docs, todo, this._cache).ptrs;
  return ptrs.length > 0;
};
const ifFn = function(regs, group, opts2) {
  const one = this.methods.one;
  if (isView(regs)) {
    return this.filter((m2) => m2.intersection(regs).found);
  }
  if (isNet(regs)) {
    let m2 = this.sweep(regs, { tagger: false }).view.settle();
    return this.if(m2);
  }
  regs = parseRegs(regs, opts2, this.world);
  let todo = { regs, group, justOne: true };
  let ptrs = this.fullPointer;
  let cache2 = this._cache || [];
  ptrs = ptrs.filter((ptr, i2) => {
    let m2 = this.update([ptr]);
    let res = one.match(m2.docs, todo, cache2[i2]).ptrs;
    return res.length > 0;
  });
  let view = this.update(ptrs);
  if (this._cache) {
    view._cache = ptrs.map((ptr) => cache2[ptr[0]]);
  }
  return view;
};
const ifNo = function(regs, group, opts2) {
  const { methods: methods2 } = this;
  const one = methods2.one;
  if (isView(regs)) {
    return this.filter((m2) => !m2.intersection(regs).found);
  }
  if (isNet(regs)) {
    let m2 = this.sweep(regs, { tagger: false }).view.settle();
    return this.ifNo(m2);
  }
  regs = parseRegs(regs, opts2, this.world);
  let cache2 = this._cache || [];
  let view = this.filter((m2, i2) => {
    let todo = { regs, group, justOne: true };
    let ptrs = one.match(m2.docs, todo, cache2[i2]).ptrs;
    return ptrs.length === 0;
  });
  if (this._cache) {
    view._cache = view.ptrs.map((ptr) => cache2[ptr[0]]);
  }
  return view;
};
var match$3 = { matchOne, match: match$2, has, if: ifFn, ifNo };
const before = function(regs, group, opts2) {
  const { indexN: indexN2 } = this.methods.one.pointer;
  let pre = [];
  let byN = indexN2(this.fullPointer);
  Object.keys(byN).forEach((k2) => {
    let first = byN[k2].sort((a2, b) => a2[1] > b[1] ? 1 : -1)[0];
    if (first[1] > 0) {
      pre.push([first[0], 0, first[1]]);
    }
  });
  let preWords = this.toView(pre);
  if (!regs) {
    return preWords;
  }
  return preWords.match(regs, group, opts2);
};
const after = function(regs, group, opts2) {
  const { indexN: indexN2 } = this.methods.one.pointer;
  let post = [];
  let byN = indexN2(this.fullPointer);
  let document2 = this.document;
  Object.keys(byN).forEach((k2) => {
    let last = byN[k2].sort((a2, b) => a2[1] > b[1] ? -1 : 1)[0];
    let [n2, , end2] = last;
    if (end2 < document2[n2].length) {
      post.push([n2, end2, document2[n2].length]);
    }
  });
  let postWords = this.toView(post);
  if (!regs) {
    return postWords;
  }
  return postWords.match(regs, group, opts2);
};
const growLeft = function(regs, group, opts2) {
  if (typeof regs === "string") {
    regs = this.world.methods.one.parseMatch(regs, opts2, this.world);
  }
  regs[regs.length - 1].end = true;
  let ptrs = this.fullPointer;
  this.forEach((m2, n2) => {
    let more = m2.before(regs, group);
    if (more.found) {
      let terms = more.terms();
      ptrs[n2][1] -= terms.length;
      ptrs[n2][3] = terms.docs[0][0].id;
    }
  });
  return this.update(ptrs);
};
const growRight = function(regs, group, opts2) {
  if (typeof regs === "string") {
    regs = this.world.methods.one.parseMatch(regs, opts2, this.world);
  }
  regs[0].start = true;
  let ptrs = this.fullPointer;
  this.forEach((m2, n2) => {
    let more = m2.after(regs, group);
    if (more.found) {
      let terms = more.terms();
      ptrs[n2][2] += terms.length;
      ptrs[n2][4] = null;
    }
  });
  return this.update(ptrs);
};
const grow = function(regs, group, opts2) {
  return this.growRight(regs, group, opts2).growLeft(regs, group, opts2);
};
var lookaround = { before, after, growLeft, growRight, grow };
const combine = function(left, right) {
  return [left[0], left[1], right[2]];
};
const isArray$5 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const getDoc$3 = (reg, view, group) => {
  if (typeof reg === "string" || isArray$5(reg)) {
    return view.match(reg, group);
  }
  if (!reg) {
    return view.none();
  }
  return reg;
};
const addIds$1 = function(ptr, view) {
  let [n2, start2, end2] = ptr;
  if (view.document[n2] && view.document[n2][start2]) {
    ptr[3] = ptr[3] || view.document[n2][start2].id;
    if (view.document[n2][end2 - 1]) {
      ptr[4] = ptr[4] || view.document[n2][end2 - 1].id;
    }
  }
  return ptr;
};
const methods$f = {};
methods$f.splitOn = function(m2, group) {
  const { splitAll: splitAll2 } = this.methods.one.pointer;
  let splits = getDoc$3(m2, this, group).fullPointer;
  let all2 = splitAll2(this.fullPointer, splits);
  let res = [];
  all2.forEach((o2) => {
    res.push(o2.passthrough);
    res.push(o2.before);
    res.push(o2.match);
    res.push(o2.after);
  });
  res = res.filter((p2) => p2);
  res = res.map((p2) => addIds$1(p2, this));
  return this.update(res);
};
methods$f.splitBefore = function(m2, group) {
  const { splitAll: splitAll2 } = this.methods.one.pointer;
  let splits = getDoc$3(m2, this, group).fullPointer;
  let all2 = splitAll2(this.fullPointer, splits);
  for (let i2 = 0; i2 < all2.length; i2 += 1) {
    if (!all2[i2].after && all2[i2 + 1] && all2[i2 + 1].before) {
      if (all2[i2].match && all2[i2].match[0] === all2[i2 + 1].before[0]) {
        all2[i2].after = all2[i2 + 1].before;
        delete all2[i2 + 1].before;
      }
    }
  }
  let res = [];
  all2.forEach((o2) => {
    res.push(o2.passthrough);
    res.push(o2.before);
    if (o2.match && o2.after) {
      res.push(combine(o2.match, o2.after));
    } else {
      res.push(o2.match);
    }
  });
  res = res.filter((p2) => p2);
  res = res.map((p2) => addIds$1(p2, this));
  return this.update(res);
};
methods$f.splitAfter = function(m2, group) {
  const { splitAll: splitAll2 } = this.methods.one.pointer;
  let splits = getDoc$3(m2, this, group).fullPointer;
  let all2 = splitAll2(this.fullPointer, splits);
  let res = [];
  all2.forEach((o2) => {
    res.push(o2.passthrough);
    if (o2.before && o2.match) {
      res.push(combine(o2.before, o2.match));
    } else {
      res.push(o2.before);
      res.push(o2.match);
    }
    res.push(o2.after);
  });
  res = res.filter((p2) => p2);
  res = res.map((p2) => addIds$1(p2, this));
  return this.update(res);
};
methods$f.split = methods$f.splitAfter;
var split$2 = methods$f;
const methods$e = Object.assign({}, match$3, lookaround, split$2);
methods$e.lookBehind = methods$e.before;
methods$e.lookBefore = methods$e.before;
methods$e.lookAhead = methods$e.after;
methods$e.lookAfter = methods$e.after;
methods$e.notIf = methods$e.ifNo;
const matchAPI = function(View2) {
  Object.assign(View2.prototype, methods$e);
};
var api$y = matchAPI;
const bySlashes = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/;
const byParentheses = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/;
const byWord$1 = / /g;
const isBlock = (str) => {
  return /^[![^]*(<[^<]*>)?\(/.test(str) && /\)[?\]+*$~]*$/.test(str);
};
const isReg = (str) => {
  return /^[![^]*(<[^<]*>)?\//.test(str) && /\/[?\]+*$~]*$/.test(str);
};
const cleanUp$1 = function(arr) {
  arr = arr.map((str) => str.trim());
  arr = arr.filter((str) => str);
  return arr;
};
const parseBlocks = function(txt) {
  let arr = txt.split(bySlashes);
  let res = [];
  arr.forEach((str) => {
    if (isReg(str)) {
      res.push(str);
      return;
    }
    res = res.concat(str.split(byParentheses));
  });
  res = cleanUp$1(res);
  let final = [];
  res.forEach((str) => {
    if (isBlock(str)) {
      final.push(str);
    } else if (isReg(str)) {
      final.push(str);
    } else {
      final = final.concat(str.split(byWord$1));
    }
  });
  final = cleanUp$1(final);
  return final;
};
var parseBlocks$1 = parseBlocks;
const hasMinMax = /\{([0-9]+)?(, *[0-9]*)?\}/;
const andSign = /&&/;
const captureName = new RegExp(/^<\s*(\S+)\s*>/);
const titleCase$2 = (str) => str.charAt(0).toUpperCase() + str.substring(1);
const end = (str) => str.charAt(str.length - 1);
const start = (str) => str.charAt(0);
const stripStart = (str) => str.substring(1);
const stripEnd = (str) => str.substring(0, str.length - 1);
const stripBoth = function(str) {
  str = stripStart(str);
  str = stripEnd(str);
  return str;
};
const parseToken = function(w, opts2) {
  let obj = {};
  for (let i2 = 0; i2 < 2; i2 += 1) {
    if (end(w) === "$") {
      obj.end = true;
      w = stripEnd(w);
    }
    if (start(w) === "^") {
      obj.start = true;
      w = stripStart(w);
    }
    if (end(w) === "?") {
      obj.optional = true;
      w = stripEnd(w);
    }
    if (start(w) === "[" || end(w) === "]") {
      obj.group = null;
      if (start(w) === "[") {
        obj.groupStart = true;
      }
      if (end(w) === "]") {
        obj.groupEnd = true;
      }
      w = w.replace(/^\[/, "");
      w = w.replace(/\]$/, "");
      if (start(w) === "<") {
        const res = captureName.exec(w);
        if (res.length >= 2) {
          obj.group = res[1];
          w = w.replace(res[0], "");
        }
      }
    }
    if (end(w) === "+") {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (w !== "*" && end(w) === "*" && w !== "\\*") {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (start(w) === "!") {
      obj.negative = true;
      w = stripStart(w);
    }
    if (start(w) === "~" && end(w) === "~" && w.length > 2) {
      w = stripBoth(w);
      obj.fuzzy = true;
      obj.min = opts2.fuzzy || 0.85;
      if (/\(/.test(w) === false) {
        obj.word = w;
        return obj;
      }
    }
    if (start(w) === "/" && end(w) === "/") {
      w = stripBoth(w);
      if (opts2.caseSensitive) {
        obj.use = "text";
      }
      obj.regex = new RegExp(w);
      return obj;
    }
    if (hasMinMax.test(w) === true) {
      w = w.replace(hasMinMax, (_a, b, c2) => {
        if (c2 === void 0) {
          obj.min = Number(b);
          obj.max = Number(b);
        } else {
          c2 = c2.replace(/, */, "");
          if (b === void 0) {
            obj.min = 0;
            obj.max = Number(c2);
          } else {
            obj.min = Number(b);
            obj.max = Number(c2 || 999);
          }
        }
        obj.greedy = true;
        if (!obj.min) {
          obj.optional = true;
        }
        return "";
      });
    }
    if (start(w) === "(" && end(w) === ")") {
      if (andSign.test(w)) {
        obj.choices = w.split(andSign);
        obj.operator = "and";
      } else {
        obj.choices = w.split("|");
        obj.operator = "or";
      }
      obj.choices[0] = stripStart(obj.choices[0]);
      let last = obj.choices.length - 1;
      obj.choices[last] = stripEnd(obj.choices[last]);
      obj.choices = obj.choices.map((s2) => s2.trim());
      obj.choices = obj.choices.filter((s2) => s2);
      obj.choices = obj.choices.map((str) => {
        return str.split(/ /g).map((s2) => parseToken(s2, opts2));
      });
      w = "";
    }
    if (start(w) === "{" && end(w) === "}") {
      w = stripBoth(w);
      obj.root = w;
      if (/\//.test(w)) {
        let split2 = obj.root.split(/\//);
        obj.root = split2[0];
        obj.pos = split2[1];
        if (obj.pos === "adj") {
          obj.pos = "Adjective";
        }
        obj.pos = obj.pos.charAt(0).toUpperCase() + obj.pos.substr(1).toLowerCase();
        if (split2[2] !== void 0) {
          obj.sense = split2[2];
        }
      }
      return obj;
    }
    if (start(w) === "<" && end(w) === ">") {
      w = stripBoth(w);
      obj.chunk = titleCase$2(w);
      obj.greedy = true;
      return obj;
    }
    if (start(w) === "%" && end(w) === "%") {
      w = stripBoth(w);
      obj.switch = w;
      return obj;
    }
  }
  if (start(w) === "#") {
    obj.tag = stripStart(w);
    obj.tag = titleCase$2(obj.tag);
    return obj;
  }
  if (start(w) === "@") {
    obj.method = stripStart(w);
    return obj;
  }
  if (w === ".") {
    obj.anything = true;
    return obj;
  }
  if (w === "*") {
    obj.anything = true;
    obj.greedy = true;
    obj.optional = true;
    return obj;
  }
  if (w) {
    w = w.replace("\\*", "*");
    w = w.replace("\\.", ".");
    if (opts2.caseSensitive) {
      obj.use = "text";
    } else {
      w = w.toLowerCase();
    }
    obj.word = w;
  }
  return obj;
};
var parseToken$1 = parseToken;
const hasDash$2 = /[a-z0-9][-–—][a-z]/i;
const splitHyphens$1 = function(regs, world2) {
  let prefixes2 = world2.model.one.prefixes;
  for (let i2 = regs.length - 1; i2 >= 0; i2 -= 1) {
    let reg = regs[i2];
    if (reg.word && hasDash$2.test(reg.word)) {
      let words2 = reg.word.split(/[-–—]/g);
      if (prefixes2.hasOwnProperty(words2[0])) {
        continue;
      }
      words2 = words2.filter((w) => w).reverse();
      regs.splice(i2, 1);
      words2.forEach((w) => {
        let obj = Object.assign({}, reg);
        obj.word = w;
        regs.splice(i2, 0, obj);
      });
    }
  }
  return regs;
};
var splitHyphens$2 = splitHyphens$1;
const addVerbs = function(token, world2) {
  let { all: all2 } = world2.methods.two.transform.verb || {};
  let str = token.root;
  if (!all2) {
    return [];
  }
  return all2(str, world2.model);
};
const addNoun = function(token, world2) {
  let { all: all2 } = world2.methods.two.transform.noun || {};
  if (!all2) {
    return [token.root];
  }
  return all2(token.root, world2.model);
};
const addAdjective = function(token, world2) {
  let { all: all2 } = world2.methods.two.transform.adjective || {};
  if (!all2) {
    return [token.root];
  }
  return all2(token.root, world2.model);
};
const inflectRoot = function(regs, world2) {
  regs = regs.map((token) => {
    if (token.root) {
      if (world2.methods.two && world2.methods.two.transform) {
        let choices = [];
        if (token.pos) {
          if (token.pos === "Verb") {
            choices = choices.concat(addVerbs(token, world2));
          } else if (token.pos === "Noun") {
            choices = choices.concat(addNoun(token, world2));
          } else if (token.pos === "Adjective") {
            choices = choices.concat(addAdjective(token, world2));
          }
        } else {
          choices = choices.concat(addVerbs(token, world2));
          choices = choices.concat(addNoun(token, world2));
          choices = choices.concat(addAdjective(token, world2));
        }
        choices = choices.filter((str) => str);
        if (choices.length > 0) {
          token.operator = "or";
          token.fastOr = new Set(choices);
        }
      } else {
        token.machine = token.root;
        delete token.id;
        delete token.root;
      }
    }
    return token;
  });
  return regs;
};
var inflectRoot$1 = inflectRoot;
const nameGroups = function(regs) {
  let index2 = 0;
  let inGroup = null;
  for (let i2 = 0; i2 < regs.length; i2++) {
    const token = regs[i2];
    if (token.groupStart === true) {
      inGroup = token.group;
      if (inGroup === null) {
        inGroup = String(index2);
        index2 += 1;
      }
    }
    if (inGroup !== null) {
      token.group = inGroup;
    }
    if (token.groupEnd === true) {
      inGroup = null;
    }
  }
  return regs;
};
const doFastOrMode = function(tokens) {
  return tokens.map((token) => {
    if (token.choices !== void 0) {
      if (token.operator !== "or") {
        return token;
      }
      if (token.fuzzy === true) {
        return token;
      }
      let shouldPack = token.choices.every((block) => {
        if (block.length !== 1) {
          return false;
        }
        let reg = block[0];
        if (reg.fuzzy === true) {
          return false;
        }
        if (reg.start || reg.end) {
          return false;
        }
        if (reg.word !== void 0 && reg.negative !== true && reg.optional !== true && reg.method !== true) {
          return true;
        }
        return false;
      });
      if (shouldPack === true) {
        token.fastOr = /* @__PURE__ */ new Set();
        token.choices.forEach((block) => {
          token.fastOr.add(block[0].word);
        });
        delete token.choices;
      }
    }
    return token;
  });
};
const fuzzyOr = function(regs) {
  return regs.map((reg) => {
    if (reg.fuzzy && reg.choices) {
      reg.choices.forEach((r2) => {
        if (r2.length === 1 && r2[0].word) {
          r2[0].fuzzy = true;
          r2[0].min = reg.min;
        }
      });
    }
    return reg;
  });
};
const postProcess$1 = function(regs) {
  regs = nameGroups(regs);
  regs = doFastOrMode(regs);
  regs = fuzzyOr(regs);
  return regs;
};
var postProcess$2 = postProcess$1;
const syntax = function(input, opts2, world2) {
  if (input === null || input === void 0 || input === "") {
    return [];
  }
  opts2 = opts2 || {};
  if (typeof input === "number") {
    input = String(input);
  }
  let tokens = parseBlocks$1(input);
  tokens = tokens.map((str) => parseToken$1(str, opts2));
  tokens = splitHyphens$2(tokens, world2);
  tokens = inflectRoot$1(tokens, world2);
  tokens = postProcess$2(tokens);
  return tokens;
};
var parseMatch = syntax;
const anyIntersection = function(setA, setB) {
  for (let elem of setB) {
    if (setA.has(elem)) {
      return true;
    }
  }
  return false;
};
const failFast = function(regs, cache2) {
  for (let i2 = 0; i2 < regs.length; i2 += 1) {
    let reg = regs[i2];
    if (reg.optional === true || reg.negative === true || reg.fuzzy === true) {
      continue;
    }
    if (reg.word !== void 0 && cache2.has(reg.word) === false) {
      return true;
    }
    if (reg.tag !== void 0 && cache2.has("#" + reg.tag) === false) {
      return true;
    }
    if (reg.fastOr && anyIntersection(reg.fastOr, cache2) === false) {
      return false;
    }
  }
  return false;
};
var failFast$1 = failFast;
const editDistance = function(strA, strB) {
  let aLength = strA.length, bLength = strB.length;
  if (aLength === 0) {
    return bLength;
  }
  if (bLength === 0) {
    return aLength;
  }
  let limit = (bLength > aLength ? bLength : aLength) + 1;
  if (Math.abs(aLength - bLength) > (limit || 100)) {
    return limit || 100;
  }
  let matrix = [];
  for (let i2 = 0; i2 < limit; i2++) {
    matrix[i2] = [i2];
    matrix[i2].length = limit;
  }
  for (let i2 = 0; i2 < limit; i2++) {
    matrix[0][i2] = i2;
  }
  let j2, a_index, b_index, cost, min2, t2;
  for (let i2 = 1; i2 <= aLength; ++i2) {
    a_index = strA[i2 - 1];
    for (j2 = 1; j2 <= bLength; ++j2) {
      if (i2 === j2 && matrix[i2][j2] > 4) {
        return aLength;
      }
      b_index = strB[j2 - 1];
      cost = a_index === b_index ? 0 : 1;
      min2 = matrix[i2 - 1][j2] + 1;
      if ((t2 = matrix[i2][j2 - 1] + 1) < min2)
        min2 = t2;
      if ((t2 = matrix[i2 - 1][j2 - 1] + cost) < min2)
        min2 = t2;
      let shouldUpdate = i2 > 1 && j2 > 1 && a_index === strB[j2 - 2] && strA[i2 - 2] === b_index && (t2 = matrix[i2 - 2][j2 - 2] + cost) < min2;
      if (shouldUpdate) {
        matrix[i2][j2] = t2;
      } else {
        matrix[i2][j2] = min2;
      }
    }
  }
  return matrix[aLength][bLength];
};
const fuzzyMatch = function(strA, strB, minLength = 3) {
  if (strA === strB) {
    return 1;
  }
  if (strA.length < minLength || strB.length < minLength) {
    return 0;
  }
  const steps = editDistance(strA, strB);
  let length2 = Math.max(strA.length, strB.length);
  let relative2 = length2 === 0 ? 0 : steps / length2;
  let similarity = 1 - relative2;
  return similarity;
};
var fuzzy = fuzzyMatch;
const startQuote = /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/;
const endQuote = /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/;
const hasHyphen$1 = /^[-–—]$/;
const hasDash$1 = / [-–—]{1,3} /;
const hasPost = (term, punct) => term.post.indexOf(punct) !== -1;
const hasPre = (term, punct) => term.pre.indexOf(punct) !== -1;
const methods$d = {
  hasQuote: (term) => startQuote.test(term.pre) || endQuote.test(term.post),
  hasComma: (term) => hasPost(term, ","),
  hasPeriod: (term) => hasPost(term, ".") === true && hasPost(term, "...") === false,
  hasExclamation: (term) => hasPost(term, "!"),
  hasQuestionMark: (term) => hasPost(term, "?") || hasPost(term, "\xBF"),
  hasEllipses: (term) => hasPost(term, "..") || hasPost(term, "\u2026") || hasPre(term, "..") || hasPre(term, "\u2026"),
  hasSemicolon: (term) => hasPost(term, ";"),
  hasColon: (term) => hasPost(term, ":"),
  hasSlash: (term) => /\//.test(term.text),
  hasHyphen: (term) => hasHyphen$1.test(term.post) || hasHyphen$1.test(term.pre),
  hasDash: (term) => hasDash$1.test(term.post) || hasDash$1.test(term.pre),
  hasContraction: (term) => Boolean(term.implicit),
  isAcronym: (term) => term.tags.has("Acronym"),
  isKnown: (term) => term.tags.size > 0,
  isTitleCase: (term) => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(term.text),
  isUpperCase: (term) => /^\p{Lu}+$/u.test(term.text)
};
methods$d.hasQuotation = methods$d.hasQuote;
var termMethods = methods$d;
let wrapMatch = function() {
};
const doesMatch$1 = function(term, reg, index2, length2) {
  if (reg.anything === true) {
    return true;
  }
  if (reg.start === true && index2 !== 0) {
    return false;
  }
  if (reg.end === true && index2 !== length2 - 1) {
    return false;
  }
  if (reg.id !== void 0 && reg.id === term.id) {
    return true;
  }
  if (reg.word !== void 0) {
    if (reg.use) {
      return reg.word === term[reg.use];
    }
    if (term.machine !== null && term.machine === reg.word) {
      return true;
    }
    if (term.alias !== void 0 && term.alias.hasOwnProperty(reg.word)) {
      return true;
    }
    if (reg.fuzzy === true) {
      if (reg.word === term.root) {
        return true;
      }
      let score = fuzzy(reg.word, term.normal);
      if (score >= reg.min) {
        return true;
      }
    }
    if (term.alias && term.alias.some((str) => str === reg.word)) {
      return true;
    }
    return reg.word === term.text || reg.word === term.normal;
  }
  if (reg.tag !== void 0) {
    return term.tags.has(reg.tag) === true;
  }
  if (reg.method !== void 0) {
    if (typeof termMethods[reg.method] === "function" && termMethods[reg.method](term) === true) {
      return true;
    }
    return false;
  }
  if (reg.pre !== void 0) {
    return term.pre && term.pre.includes(reg.pre);
  }
  if (reg.post !== void 0) {
    return term.post && term.post.includes(reg.post);
  }
  if (reg.regex !== void 0) {
    let str = term.normal;
    if (reg.use) {
      str = term[reg.use];
    }
    return reg.regex.test(str);
  }
  if (reg.chunk !== void 0) {
    return term.chunk === reg.chunk;
  }
  if (reg.switch !== void 0) {
    return term.switch === reg.switch;
  }
  if (reg.machine !== void 0) {
    return term.normal === reg.machine || term.machine === reg.machine || term.root === reg.machine;
  }
  if (reg.sense !== void 0) {
    return term.sense === reg.sense;
  }
  if (reg.fastOr !== void 0) {
    if (reg.pos && !term.tags.has(reg.pos)) {
      return null;
    }
    let str = term.root || term.implicit || term.machine || term.normal;
    return reg.fastOr.has(str) || reg.fastOr.has(term.text);
  }
  if (reg.choices !== void 0) {
    if (reg.operator === "and") {
      return reg.choices.every((r2) => wrapMatch(term, r2, index2, length2));
    }
    return reg.choices.some((r2) => wrapMatch(term, r2, index2, length2));
  }
  return false;
};
wrapMatch = function(t2, reg, index2, length2) {
  let result = doesMatch$1(t2, reg, index2, length2);
  if (reg.negative === true) {
    return !result;
  }
  return result;
};
var matchTerm = wrapMatch;
const getGreedy = function(state, endReg) {
  let reg = Object.assign({}, state.regs[state.r], { start: false, end: false });
  let start2 = state.t;
  for (; state.t < state.terms.length; state.t += 1) {
    if (endReg && matchTerm(state.terms[state.t], endReg, state.start_i + state.t, state.phrase_length)) {
      return state.t;
    }
    let count = state.t - start2 + 1;
    if (reg.max !== void 0 && count === reg.max) {
      return state.t;
    }
    if (matchTerm(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length) === false) {
      if (reg.min !== void 0 && count < reg.min) {
        return null;
      }
      return state.t;
    }
  }
  return state.t;
};
const greedyTo = function(state, nextReg) {
  let t2 = state.t;
  if (!nextReg) {
    return state.terms.length;
  }
  for (; t2 < state.terms.length; t2 += 1) {
    if (matchTerm(state.terms[t2], nextReg, state.start_i + t2, state.phrase_length) === true) {
      return t2;
    }
  }
  return null;
};
const isEndGreedy = function(reg, state) {
  if (reg.end === true && reg.greedy === true) {
    if (state.start_i + state.t < state.phrase_length - 1) {
      let tmpReg = Object.assign({}, reg, { end: false });
      if (matchTerm(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length) === true) {
        return true;
      }
    }
  }
  return false;
};
const getGroup$2 = function(state, term_index) {
  if (state.groups[state.inGroup]) {
    return state.groups[state.inGroup];
  }
  state.groups[state.inGroup] = {
    start: term_index,
    length: 0
  };
  return state.groups[state.inGroup];
};
const doAstrix = function(state) {
  let { regs } = state;
  let reg = regs[state.r];
  let skipto = greedyTo(state, regs[state.r + 1]);
  if (skipto === null || skipto === 0) {
    return null;
  }
  if (reg.min !== void 0 && skipto - state.t < reg.min) {
    return null;
  }
  if (reg.max !== void 0 && skipto - state.t > reg.max) {
    state.t = state.t + reg.max;
    return true;
  }
  if (state.hasGroup === true) {
    const g2 = getGroup$2(state, state.t);
    g2.length = skipto - state.t;
  }
  state.t = skipto;
  return true;
};
var doAstrix$1 = doAstrix;
const isArray$4 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const doOrBlock$1 = function(state, skipN = 0) {
  let block = state.regs[state.r];
  let wasFound = false;
  for (let c2 = 0; c2 < block.choices.length; c2 += 1) {
    let regs = block.choices[c2];
    if (!isArray$4(regs)) {
      return false;
    }
    wasFound = regs.every((cr, w_index) => {
      let extra = 0;
      let t2 = state.t + w_index + skipN + extra;
      if (state.terms[t2] === void 0) {
        return false;
      }
      let foundBlock = matchTerm(state.terms[t2], cr, t2 + state.start_i, state.phrase_length);
      if (foundBlock === true && cr.greedy === true) {
        for (let i2 = 1; i2 < state.terms.length; i2 += 1) {
          let term = state.terms[t2 + i2];
          if (term) {
            let keepGoing = matchTerm(term, cr, state.start_i + i2, state.phrase_length);
            if (keepGoing === true) {
              extra += 1;
            } else {
              break;
            }
          }
        }
      }
      skipN += extra;
      return foundBlock;
    });
    if (wasFound) {
      skipN += regs.length;
      break;
    }
  }
  if (wasFound && block.greedy === true) {
    return doOrBlock$1(state, skipN);
  }
  return skipN;
};
const doAndBlock$1 = function(state) {
  let longest = 0;
  let reg = state.regs[state.r];
  let allDidMatch = reg.choices.every((block) => {
    let allWords = block.every((cr, w_index) => {
      let tryTerm = state.t + w_index;
      if (state.terms[tryTerm] === void 0) {
        return false;
      }
      return matchTerm(state.terms[tryTerm], cr, tryTerm, state.phrase_length);
    });
    if (allWords === true && block.length > longest) {
      longest = block.length;
    }
    return allWords;
  });
  if (allDidMatch === true) {
    return longest;
  }
  return false;
};
const orBlock = function(state) {
  const { regs } = state;
  let reg = regs[state.r];
  let skipNum = doOrBlock$1(state);
  if (skipNum) {
    if (reg.negative === true) {
      return null;
    }
    if (state.hasGroup === true) {
      const g2 = getGroup$2(state, state.t);
      g2.length += skipNum;
    }
    if (reg.end === true) {
      let end2 = state.phrase_length;
      if (state.t + state.start_i + skipNum !== end2) {
        return null;
      }
    }
    state.t += skipNum;
    return true;
  } else if (!reg.optional) {
    return null;
  }
  return true;
};
var doOrBlock = orBlock;
const andBlock = function(state) {
  const { regs } = state;
  let reg = regs[state.r];
  let skipNum = doAndBlock$1(state);
  if (skipNum) {
    if (reg.negative === true) {
      return null;
    }
    if (state.hasGroup === true) {
      const g2 = getGroup$2(state, state.t);
      g2.length += skipNum;
    }
    if (reg.end === true) {
      let end2 = state.phrase_length - 1;
      if (state.t + state.start_i !== end2) {
        return null;
      }
    }
    state.t += skipNum;
    return true;
  } else if (!reg.optional) {
    return null;
  }
  return true;
};
var doAndBlock = andBlock;
const negGreedy = function(state, reg, nextReg) {
  let skip = 0;
  for (let t2 = state.t; t2 < state.terms.length; t2 += 1) {
    let found = matchTerm(state.terms[t2], reg, state.start_i + state.t, state.phrase_length);
    if (found) {
      break;
    }
    if (nextReg) {
      found = matchTerm(state.terms[t2], nextReg, state.start_i + state.t, state.phrase_length);
      if (found) {
        break;
      }
    }
    skip += 1;
    if (reg.max !== void 0 && skip === reg.max) {
      break;
    }
  }
  if (skip === 0) {
    return false;
  }
  if (reg.min && reg.min > skip) {
    return false;
  }
  state.t += skip;
  return true;
};
var negGreedy$1 = negGreedy;
const doNegative = function(state) {
  const { regs } = state;
  let reg = regs[state.r];
  let tmpReg = Object.assign({}, reg);
  tmpReg.negative = false;
  let found = matchTerm(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length);
  if (found) {
    return false;
  }
  if (reg.optional) {
    let nextReg = regs[state.r + 1];
    if (nextReg) {
      let fNext = matchTerm(state.terms[state.t], nextReg, state.start_i + state.t, state.phrase_length);
      if (fNext) {
        state.r += 1;
      } else if (nextReg.optional && regs[state.r + 2]) {
        let fNext2 = matchTerm(state.terms[state.t], regs[state.r + 2], state.start_i + state.t, state.phrase_length);
        if (fNext2) {
          state.r += 2;
        }
      }
    }
  }
  if (reg.greedy) {
    return negGreedy$1(state, tmpReg, regs[state.r + 1]);
  }
  state.t += 1;
  return true;
};
var doNegative$1 = doNegative;
const foundOptional = function(state) {
  const { regs } = state;
  let reg = regs[state.r];
  let term = state.terms[state.t];
  let nextRegMatched = matchTerm(term, regs[state.r + 1], state.start_i + state.t, state.phrase_length);
  if (reg.negative || nextRegMatched) {
    let nextTerm = state.terms[state.t + 1];
    if (!nextTerm || !matchTerm(nextTerm, regs[state.r + 1], state.start_i + state.t, state.phrase_length)) {
      state.r += 1;
    }
  }
};
var foundOptional$1 = foundOptional;
const greedyMatch = function(state) {
  const { regs, phrase_length } = state;
  let reg = regs[state.r];
  state.t = getGreedy(state, regs[state.r + 1]);
  if (state.t === null) {
    return null;
  }
  if (reg.min && reg.min > state.t) {
    return null;
  }
  if (reg.end === true && state.start_i + state.t !== phrase_length) {
    return null;
  }
  return true;
};
var greedyMatch$1 = greedyMatch;
const contractionSkip = function(state) {
  let term = state.terms[state.t];
  let reg = state.regs[state.r];
  if (term.implicit && state.terms[state.t + 1]) {
    let nextTerm = state.terms[state.t + 1];
    if (!nextTerm.implicit) {
      return;
    }
    if (reg.word === term.normal) {
      state.t += 1;
    }
    if (reg.method === "hasContraction") {
      state.t += 1;
    }
  }
};
var contractionSkip$1 = contractionSkip;
const setGroup = function(state, startAt) {
  let reg = state.regs[state.r];
  const g2 = getGroup$2(state, startAt);
  if (state.t > 1 && reg.greedy) {
    g2.length += state.t - startAt;
  } else {
    g2.length++;
  }
};
const simpleMatch = function(state) {
  const { regs } = state;
  let reg = regs[state.r];
  let term = state.terms[state.t];
  let startAt = state.t;
  if (reg.optional && regs[state.r + 1] && reg.negative) {
    return true;
  }
  if (reg.optional && regs[state.r + 1]) {
    foundOptional$1(state);
  }
  if (term.implicit && state.terms[state.t + 1]) {
    contractionSkip$1(state);
  }
  state.t += 1;
  if (reg.end === true && state.t !== state.terms.length && reg.greedy !== true) {
    return null;
  }
  if (reg.greedy === true) {
    let alive = greedyMatch$1(state);
    if (!alive) {
      return null;
    }
  }
  if (state.hasGroup === true) {
    setGroup(state, startAt);
  }
  return true;
};
var simpleMatch$1 = simpleMatch;
const tryHere = function(terms, regs, start_i, phrase_length) {
  if (terms.length === 0 || regs.length === 0) {
    return null;
  }
  let state = {
    t: 0,
    terms,
    r: 0,
    regs,
    groups: {},
    start_i,
    phrase_length,
    inGroup: null
  };
  for (; state.r < regs.length; state.r += 1) {
    let reg = regs[state.r];
    state.hasGroup = Boolean(reg.group);
    if (state.hasGroup === true) {
      state.inGroup = reg.group;
    } else {
      state.inGroup = null;
    }
    if (!state.terms[state.t]) {
      const alive = regs.slice(state.r).some((remain) => !remain.optional);
      if (alive === false) {
        break;
      }
      return null;
    }
    if (reg.anything === true && reg.greedy === true) {
      let alive = doAstrix$1(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (reg.choices !== void 0 && reg.operator === "or") {
      let alive = doOrBlock(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (reg.choices !== void 0 && reg.operator === "and") {
      let alive = doAndBlock(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (reg.anything === true) {
      if (reg.negative && reg.anything) {
        return null;
      }
      let alive = simpleMatch$1(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (isEndGreedy(reg, state) === true) {
      let alive = simpleMatch$1(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (reg.negative) {
      let alive = doNegative$1(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    let hasMatch = matchTerm(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length);
    if (hasMatch === true) {
      let alive = simpleMatch$1(state);
      if (!alive) {
        return null;
      }
      continue;
    }
    if (reg.optional === true) {
      continue;
    }
    return null;
  }
  let pntr = [null, start_i, state.t + start_i];
  if (pntr[1] === pntr[2]) {
    return null;
  }
  let groups = {};
  Object.keys(state.groups).forEach((k2) => {
    let o2 = state.groups[k2];
    let start2 = start_i + o2.start;
    groups[k2] = [null, start2, start2 + o2.length];
  });
  return { pointer: pntr, groups };
};
var fromHere = tryHere;
const getGroup = function(res, group) {
  let ptrs = [];
  let byGroup = {};
  if (res.length === 0) {
    return { ptrs, byGroup };
  }
  if (typeof group === "number") {
    group = String(group);
  }
  if (group) {
    res.forEach((r2) => {
      if (r2.groups[group]) {
        ptrs.push(r2.groups[group]);
      }
    });
  } else {
    res.forEach((r2) => {
      ptrs.push(r2.pointer);
      Object.keys(r2.groups).forEach((k2) => {
        byGroup[k2] = byGroup[k2] || [];
        byGroup[k2].push(r2.groups[k2]);
      });
    });
  }
  return { ptrs, byGroup };
};
var getGroup$1 = getGroup;
const notIf$1 = function(results, not, docs) {
  results = results.filter((res) => {
    let [n2, start2, end2] = res.pointer;
    let terms = docs[n2].slice(start2, end2);
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let slice = terms.slice(i2);
      let found = fromHere(slice, not, i2, terms.length);
      if (found !== null) {
        return false;
      }
    }
    return true;
  });
  return results;
};
var notIf$2 = notIf$1;
const addSentence = function(res, n2) {
  res.pointer[0] = n2;
  Object.keys(res.groups).forEach((k2) => {
    res.groups[k2][0] = n2;
  });
  return res;
};
const handleStart = function(terms, regs, n2) {
  let res = fromHere(terms, regs, 0, terms.length);
  if (res) {
    res = addSentence(res, n2);
    return res;
  }
  return null;
};
const runMatch$2 = function(docs, todo, cache2) {
  cache2 = cache2 || [];
  let { regs, group, justOne } = todo;
  let results = [];
  if (!regs || regs.length === 0) {
    return { ptrs: [], byGroup: {} };
  }
  const minLength = regs.filter((r2) => r2.optional !== true && r2.negative !== true).length;
  docs:
    for (let n2 = 0; n2 < docs.length; n2 += 1) {
      let terms = docs[n2];
      if (cache2[n2] && failFast$1(regs, cache2[n2])) {
        continue;
      }
      if (regs[0].start === true) {
        let foundStart = handleStart(terms, regs, n2);
        if (foundStart) {
          results.push(foundStart);
        }
        continue;
      }
      for (let i2 = 0; i2 < terms.length; i2 += 1) {
        let slice = terms.slice(i2);
        if (slice.length < minLength) {
          break;
        }
        let res = fromHere(slice, regs, i2, terms.length);
        if (res) {
          res = addSentence(res, n2);
          results.push(res);
          if (justOne === true) {
            break docs;
          }
          let end2 = res.pointer[2];
          if (Math.abs(end2 - 1) > i2) {
            i2 = Math.abs(end2 - 1);
          }
        }
      }
    }
  if (regs[regs.length - 1].end === true) {
    results = results.filter((res) => {
      let n2 = res.pointer[0];
      return docs[n2].length === res.pointer[2];
    });
  }
  if (todo.notIf) {
    results = notIf$2(results, todo.notIf, docs);
  }
  results = getGroup$1(results, group);
  results.ptrs.forEach((ptr) => {
    let [n2, start2, end2] = ptr;
    ptr[3] = docs[n2][start2].id;
    ptr[4] = docs[n2][end2 - 1].id;
  });
  return results;
};
var match$1 = runMatch$2;
const methods$b = {
  one: {
    termMethods,
    parseMatch,
    match: match$1
  }
};
var methods$c = methods$b;
var lib$3 = {
  parseMatch: function(str, opts2) {
    const world2 = this.world();
    let killUnicode2 = world2.methods.one.killUnicode;
    if (killUnicode2) {
      str = killUnicode2(str, world2);
    }
    return world2.methods.one.parseMatch(str, opts2, world2);
  }
};
var match = {
  api: api$y,
  methods: methods$c,
  lib: lib$3
};
const isClass = /^\../;
const isId = /^#./;
const escapeXml = (str) => {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&apos;");
  return str;
};
const toTag = function(k2) {
  let start2 = "";
  let end2 = "</span>";
  k2 = escapeXml(k2);
  if (isClass.test(k2)) {
    start2 = `<span class="${k2.replace(/^\./, "")}"`;
  } else if (isId.test(k2)) {
    start2 = `<span id="${k2.replace(/^#/, "")}"`;
  } else {
    start2 = `<${k2}`;
    end2 = `</${k2}>`;
  }
  start2 += ">";
  return { start: start2, end: end2 };
};
const getIndex = function(doc, obj) {
  let starts = {};
  let ends = {};
  Object.keys(obj).forEach((k2) => {
    let res = obj[k2];
    let tag2 = toTag(k2);
    if (typeof res === "string") {
      res = doc.match(res);
    }
    res.docs.forEach((terms) => {
      if (terms.every((t2) => t2.implicit)) {
        return;
      }
      let a2 = terms[0].id;
      starts[a2] = starts[a2] || [];
      starts[a2].push(tag2.start);
      let b = terms[terms.length - 1].id;
      ends[b] = ends[b] || [];
      ends[b].push(tag2.end);
    });
  });
  return { starts, ends };
};
const html = function(obj) {
  let { starts, ends } = getIndex(this, obj);
  let out2 = "";
  this.docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let t2 = terms[i2];
      if (starts.hasOwnProperty(t2.id)) {
        out2 += starts[t2.id].join("");
      }
      out2 += t2.pre || "" + t2.text || "";
      if (ends.hasOwnProperty(t2.id)) {
        out2 += ends[t2.id].join("");
      }
      out2 += t2.post || "";
    }
  });
  return out2;
};
var html$1 = { html };
const trimEnd = /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/;
const trimStart = /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/;
const punctToKill = /[,:;)('"\u201D\]]/;
const isHyphen = /^[-–—]$/;
const hasSpace = / /;
const textFromTerms = function(terms, opts2, keepSpace = true) {
  let txt = "";
  terms.forEach((t2) => {
    let pre = t2.pre || "";
    let post = t2.post || "";
    if (opts2.punctuation === "some") {
      pre = pre.replace(trimStart, "");
      if (isHyphen.test(post)) {
        post = " ";
      }
      post = post.replace(punctToKill, "");
      post = post.replace(/\?!+/, "?");
      post = post.replace(/!+/, "!");
      post = post.replace(/\?+/, "?");
      post = post.replace(/\.{2,}/, "");
      if (t2.tags.has("Abbreviation")) {
        post = post.replace(/\./, "");
      }
    }
    if (opts2.whitespace === "some") {
      pre = pre.replace(/\s/, "");
      post = post.replace(/\s+/, " ");
    }
    if (!opts2.keepPunct) {
      pre = pre.replace(trimStart, "");
      if (post === "-") {
        post = " ";
      } else {
        post = post.replace(trimEnd, "");
      }
    }
    let word = t2[opts2.form || "text"] || t2.normal || "";
    if (opts2.form === "implicit") {
      word = t2.implicit || t2.text;
    }
    if (opts2.form === "root" && t2.implicit) {
      word = t2.root || t2.implicit || t2.normal;
    }
    if ((opts2.form === "machine" || opts2.form === "implicit" || opts2.form === "root") && t2.implicit) {
      if (!post || !hasSpace.test(post)) {
        post += " ";
      }
    }
    txt += pre + word + post;
  });
  if (keepSpace === false) {
    txt = txt.trim();
  }
  if (opts2.lowerCase === true) {
    txt = txt.toLowerCase();
  }
  return txt;
};
const textFromDoc = function(docs, opts2) {
  let text2 = "";
  if (!docs || !docs[0] || !docs[0][0]) {
    return text2;
  }
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    text2 += textFromTerms(docs[i2], opts2, true);
  }
  if (!opts2.keepSpace) {
    text2 = text2.trim();
  }
  if (opts2.keepEndPunct === false) {
    if (!docs[0][0].tags.has("Emoticon")) {
      text2 = text2.replace(trimStart, "");
    }
    let last = docs[docs.length - 1];
    if (!last[last.length - 1].tags.has("Emoticon")) {
      text2 = text2.replace(trimEnd, "");
    }
  }
  if (opts2.cleanWhitespace === true) {
    text2 = text2.trim();
  }
  return text2;
};
const fmts = {
  text: {
    form: "text"
  },
  normal: {
    whitespace: "some",
    punctuation: "some",
    case: "some",
    unicode: "some",
    form: "normal"
  },
  machine: {
    keepSpace: false,
    whitespace: "some",
    punctuation: "some",
    case: "none",
    unicode: "some",
    form: "machine"
  },
  root: {
    keepSpace: false,
    whitespace: "some",
    punctuation: "some",
    case: "some",
    unicode: "some",
    form: "root"
  },
  implicit: {
    form: "implicit"
  }
};
fmts.clean = fmts.normal;
fmts.reduced = fmts.root;
var fmts$1 = fmts;
let k = [], i$1 = 0;
for (; i$1 < 64; ) {
  k[i$1] = 0 | Math.sin(++i$1 % Math.PI) * 4294967296;
}
function md5(s2) {
  let b, c2, d2, h2 = [b = 1732584193, c2 = 4023233417, ~b, ~c2], words2 = [], j2 = decodeURI(encodeURI(s2)) + "\x80", a2 = j2.length;
  s2 = --a2 / 4 + 2 | 15;
  words2[--s2] = a2 * 8;
  for (; ~a2; ) {
    words2[a2 >> 2] |= j2.charCodeAt(a2) << 8 * a2--;
  }
  for (i$1 = j2 = 0; i$1 < s2; i$1 += 16) {
    a2 = h2;
    for (; j2 < 64; a2 = [
      d2 = a2[3],
      b + ((d2 = a2[0] + [
        b & c2 | ~b & d2,
        d2 & b | ~d2 & c2,
        b ^ c2 ^ d2,
        c2 ^ (b | ~d2)
      ][a2 = j2 >> 4] + k[j2] + ~~words2[i$1 | [
        j2,
        5 * j2 + 1,
        3 * j2 + 5,
        7 * j2
      ][a2] & 15]) << (a2 = [
        7,
        12,
        17,
        22,
        5,
        9,
        14,
        20,
        4,
        11,
        16,
        23,
        6,
        10,
        15,
        21
      ][4 * a2 + j2++ % 4]) | d2 >>> -a2),
      b,
      c2
    ]) {
      b = a2[1] | 0;
      c2 = a2[2];
    }
    for (j2 = 4; j2; )
      h2[--j2] += a2[j2];
  }
  for (s2 = ""; j2 < 32; ) {
    s2 += (h2[j2 >> 3] >> (1 ^ j2++) * 4 & 15).toString(16);
  }
  return s2;
}
const defaults$2 = {
  text: true,
  terms: true
};
let opts = { case: "none", unicode: "some", form: "machine", punctuation: "some" };
const merge = function(a2, b) {
  return Object.assign({}, a2, b);
};
const fns$2 = {
  text: (terms) => textFromTerms(terms, { keepPunct: true }, false),
  normal: (terms) => textFromTerms(terms, merge(fmts$1.normal, { keepPunct: true }), false),
  implicit: (terms) => textFromTerms(terms, merge(fmts$1.implicit, { keepPunct: true }), false),
  machine: (terms) => textFromTerms(terms, opts, false),
  root: (terms) => textFromTerms(terms, merge(opts, { form: "root" }), false),
  hash: (terms) => md5(textFromTerms(terms, { keepPunct: true }, false)),
  offset: (terms) => {
    let len = fns$2.text(terms).length;
    return {
      index: terms[0].offset.index,
      start: terms[0].offset.start,
      length: len
    };
  },
  terms: (terms) => {
    return terms.map((t2) => {
      let term = Object.assign({}, t2);
      term.tags = Array.from(t2.tags);
      return term;
    });
  },
  confidence: (_terms, view, i2) => view.eq(i2).confidence(),
  syllables: (_terms, view, i2) => view.eq(i2).syllables(),
  sentence: (_terms, view, i2) => view.eq(i2).fullSentence().text(),
  dirty: (terms) => terms.some((t2) => t2.dirty === true)
};
fns$2.sentences = fns$2.sentence;
fns$2.clean = fns$2.normal;
fns$2.reduced = fns$2.root;
const toJSON$4 = function(view, option) {
  option = option || {};
  if (typeof option === "string") {
    option = {};
  }
  option = Object.assign({}, defaults$2, option);
  if (option.offset) {
    view.compute("offset");
  }
  return view.docs.map((terms, i2) => {
    let res = {};
    Object.keys(option).forEach((k2) => {
      if (option[k2] && fns$2[k2]) {
        res[k2] = fns$2[k2](terms, view, i2);
      }
    });
    return res;
  });
};
const methods$a = {
  json: function(n2) {
    let res = toJSON$4(this, n2);
    if (typeof n2 === "number") {
      return res[n2];
    }
    return res;
  }
};
methods$a.data = methods$a.json;
var json = methods$a;
const logClientSide = function(view) {
  console.log("%c -=-=- ", "background-color:#6699cc;");
  view.forEach((m2) => {
    console.groupCollapsed(m2.text());
    let terms = m2.docs[0];
    let out2 = terms.map((t2) => {
      let text2 = t2.text || "-";
      if (t2.implicit) {
        text2 = "[" + t2.implicit + "]";
      }
      let tags2 = "[" + Array.from(t2.tags).join(", ") + "]";
      return { text: text2, tags: tags2 };
    });
    console.table(out2, ["text", "tags"]);
    console.groupEnd();
  });
};
var logClientSide$1 = logClientSide;
const reset = "\x1B[0m";
const cli = {
  green: (str) => "\x1B[32m" + str + reset,
  red: (str) => "\x1B[31m" + str + reset,
  blue: (str) => "\x1B[34m" + str + reset,
  magenta: (str) => "\x1B[35m" + str + reset,
  cyan: (str) => "\x1B[36m" + str + reset,
  yellow: (str) => "\x1B[33m" + str + reset,
  black: (str) => "\x1B[30m" + str + reset,
  dim: (str) => "\x1B[2m" + str + reset,
  i: (str) => "\x1B[3m" + str + reset
};
var cli$1 = cli;
const tagString = function(tags2, model2) {
  if (model2.one.tagSet) {
    tags2 = tags2.map((tag2) => {
      if (!model2.one.tagSet.hasOwnProperty(tag2)) {
        return tag2;
      }
      const c2 = model2.one.tagSet[tag2].color || "blue";
      return cli$1[c2](tag2);
    });
  }
  return tags2.join(", ");
};
const showTags = function(view) {
  let { docs, model: model2 } = view;
  if (docs.length === 0) {
    console.log(cli$1.blue("\n     \u2500\u2500\u2500\u2500\u2500\u2500"));
  }
  docs.forEach((terms) => {
    console.log(cli$1.blue("\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
    terms.forEach((t2) => {
      let tags2 = [...t2.tags || []];
      let text2 = t2.text || "-";
      if (t2.sense) {
        text2 = `{${t2.normal}/${t2.sense}}`;
      }
      if (t2.implicit) {
        text2 = "[" + t2.implicit + "]";
      }
      text2 = cli$1.yellow(text2);
      let word = "'" + text2 + "'";
      if (t2.reference) {
        let str2 = view.update([t2.reference]).text("normal");
        word += ` - ${cli$1.dim(cli$1.i("[" + str2 + "]"))}`;
      }
      word = word.padEnd(18);
      let str = cli$1.blue("  \u2502 ") + cli$1.i(word) + "  - " + tagString(tags2, model2);
      console.log(str);
    });
  });
};
var showTags$1 = showTags;
const showChunks = function(view) {
  let { docs } = view;
  console.log("");
  docs.forEach((terms) => {
    let out2 = [];
    terms.forEach((term) => {
      if (term.chunk === "Noun") {
        out2.push(cli$1.blue(term.implicit || term.normal));
      } else if (term.chunk === "Verb") {
        out2.push(cli$1.green(term.implicit || term.normal));
      } else if (term.chunk === "Adjective") {
        out2.push(cli$1.yellow(term.implicit || term.normal));
      } else if (term.chunk === "Pivot") {
        out2.push(cli$1.red(term.implicit || term.normal));
      } else {
        out2.push(term.implicit || term.normal);
      }
    });
    console.log(out2.join(" "), "\n");
  });
};
var showChunks$1 = showChunks;
const split$1 = (txt, offset2, index2) => {
  let buff = index2 * 9;
  let start2 = offset2.start + buff;
  let end2 = start2 + offset2.length;
  let pre = txt.substring(0, start2);
  let mid = txt.substring(start2, end2);
  let post = txt.substring(end2, txt.length);
  return [pre, mid, post];
};
const spliceIn = function(txt, offset2, index2) {
  let parts = split$1(txt, offset2, index2);
  return `${parts[0]}${cli$1.blue(parts[1])}${parts[2]}`;
};
const showHighlight = function(doc) {
  if (!doc.found) {
    return;
  }
  let bySentence = {};
  doc.fullPointer.forEach((ptr) => {
    bySentence[ptr[0]] = bySentence[ptr[0]] || [];
    bySentence[ptr[0]].push(ptr);
  });
  Object.keys(bySentence).forEach((k2) => {
    let full = doc.update([[Number(k2)]]);
    let txt = full.text();
    let matches2 = doc.update(bySentence[k2]);
    let json2 = matches2.json({ offset: true });
    json2.forEach((obj, i2) => {
      txt = spliceIn(txt, obj.offset, i2);
    });
    console.log(txt);
  });
};
var showHighlight$1 = showHighlight;
function isClientSide() {
  return typeof window !== "undefined" && window.document;
}
const debug = function(opts2 = {}) {
  let view = this;
  if (typeof opts2 === "string") {
    let tmp = {};
    tmp[opts2] = true;
    opts2 = tmp;
  }
  if (isClientSide()) {
    logClientSide$1(view);
    return view;
  }
  if (opts2.tags !== false) {
    showTags$1(view);
    console.log("\n");
  }
  if (opts2.chunks === true) {
    showChunks$1(view);
    console.log("\n");
  }
  if (opts2.highlight === true) {
    showHighlight$1(view);
    console.log("\n");
  }
  return view;
};
var debug$1 = debug;
const toText$3 = function(term) {
  let pre = term.pre || "";
  let post = term.post || "";
  return pre + term.text + post;
};
const findStarts = function(doc, obj) {
  let starts = {};
  Object.keys(obj).forEach((reg) => {
    let m2 = doc.match(reg);
    m2.fullPointer.forEach((a2) => {
      starts[a2[3]] = { fn: obj[reg], end: a2[2] };
    });
  });
  return starts;
};
const wrap = function(doc, obj) {
  let starts = findStarts(doc, obj);
  let text2 = "";
  doc.docs.forEach((terms, n2) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let t2 = terms[i2];
      if (starts.hasOwnProperty(t2.id)) {
        let { fn, end: end2 } = starts[t2.id];
        let m2 = doc.update([[n2, i2, end2]]);
        text2 += terms[i2].pre || "";
        text2 += fn(m2);
        i2 = end2 - 1;
        text2 += terms[i2].post || "";
      } else {
        text2 += toText$3(t2);
      }
    }
  });
  return text2;
};
var wrap$1 = wrap;
const isObject$2 = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
const topk = function(arr) {
  let obj = {};
  arr.forEach((a2) => {
    obj[a2] = obj[a2] || 0;
    obj[a2] += 1;
  });
  let res = Object.keys(obj).map((k2) => {
    return { normal: k2, count: obj[k2] };
  });
  return res.sort((a2, b) => a2.count > b.count ? -1 : 0);
};
const out = function(method) {
  if (isObject$2(method)) {
    return wrap$1(this, method);
  }
  if (method === "text") {
    return this.text();
  }
  if (method === "normal") {
    return this.text("normal");
  }
  if (method === "root") {
    return this.text("root");
  }
  if (method === "machine" || method === "reduced") {
    return this.text("machine");
  }
  if (method === "hash" || method === "md5") {
    return md5(this.text());
  }
  if (method === "json") {
    return this.json();
  }
  if (method === "offset" || method === "offsets") {
    this.compute("offset");
    return this.json({ offset: true });
  }
  if (method === "array") {
    let arr = this.docs.map((terms) => {
      return terms.reduce((str, t2) => {
        return str + t2.pre + t2.text + t2.post;
      }, "").trim();
    });
    return arr.filter((str) => str);
  }
  if (method === "freq" || method === "frequency" || method === "topk") {
    return topk(this.json({ normal: true }).map((o2) => o2.normal));
  }
  if (method === "terms") {
    let list2 = [];
    this.docs.forEach((s2) => {
      let terms = s2.terms.map((t2) => t2.text);
      terms = terms.filter((t2) => t2);
      list2 = list2.concat(terms);
    });
    return list2;
  }
  if (method === "tags") {
    return this.docs.map((terms) => {
      return terms.reduce((h2, t2) => {
        h2[t2.implicit || t2.normal] = Array.from(t2.tags);
        return h2;
      }, {});
    });
  }
  if (method === "debug") {
    return this.debug();
  }
  return this.text();
};
const methods$9 = {
  debug: debug$1,
  out,
  wrap: function(obj) {
    return wrap$1(this, obj);
  }
};
var out$1 = methods$9;
const isObject$1 = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
var text = {
  text: function(fmt2) {
    let opts2 = {};
    if (fmt2 && typeof fmt2 === "string" && fmts$1.hasOwnProperty(fmt2)) {
      opts2 = Object.assign({}, fmts$1[fmt2]);
    } else if (fmt2 && isObject$1(fmt2)) {
      opts2 = Object.assign({}, fmt2);
    }
    if (opts2.keepSpace === void 0 && !this.isFull()) {
      opts2.keepSpace = false;
    }
    if (opts2.keepEndPunct === void 0 && this.pointer) {
      let ptr = this.pointer[0];
      if (ptr && ptr[1]) {
        opts2.keepEndPunct = false;
      } else {
        opts2.keepEndPunct = true;
      }
    }
    if (opts2.keepPunct === void 0) {
      opts2.keepPunct = true;
    }
    if (opts2.keepSpace === void 0) {
      opts2.keepSpace = true;
    }
    return textFromDoc(this.docs, opts2);
  }
};
const methods$8 = Object.assign({}, out$1, text, json, html$1);
const addAPI$1 = function(View2) {
  Object.assign(View2.prototype, methods$8);
};
var api$x = addAPI$1;
var output = {
  api: api$x,
  methods: {
    one: {
      hash: md5
    }
  }
};
const doesOverlap = function(a2, b) {
  if (a2[0] !== b[0]) {
    return false;
  }
  let [, startA, endA] = a2;
  let [, startB, endB] = b;
  if (startA <= startB && endA > startB) {
    return true;
  }
  if (startB <= startA && endB > startA) {
    return true;
  }
  return false;
};
const getExtent = function(ptrs) {
  let min2 = ptrs[0][1];
  let max2 = ptrs[0][2];
  ptrs.forEach((ptr) => {
    if (ptr[1] < min2) {
      min2 = ptr[1];
    }
    if (ptr[2] > max2) {
      max2 = ptr[2];
    }
  });
  return [ptrs[0][0], min2, max2];
};
const indexN = function(ptrs) {
  let byN = {};
  ptrs.forEach((ref2) => {
    byN[ref2[0]] = byN[ref2[0]] || [];
    byN[ref2[0]].push(ref2);
  });
  return byN;
};
const uniquePtrs = function(arr) {
  let obj = {};
  for (let i2 = 0; i2 < arr.length; i2 += 1) {
    obj[arr[i2].join(",")] = arr[i2];
  }
  return Object.values(obj);
};
const pivotBy = function(full, m2) {
  let [n2, start2] = full;
  let mStart = m2[1];
  let mEnd = m2[2];
  let res = {};
  if (start2 < mStart) {
    let end2 = mStart < full[2] ? mStart : full[2];
    res.before = [n2, start2, end2];
  }
  res.match = m2;
  if (full[2] > mEnd) {
    res.after = [n2, mEnd, full[2]];
  }
  return res;
};
const doesMatch = function(full, m2) {
  return full[1] <= m2[1] && m2[2] <= full[2];
};
const splitAll = function(full, m2) {
  let byN = indexN(m2);
  let res = [];
  full.forEach((ptr) => {
    let [n2] = ptr;
    let matches2 = byN[n2] || [];
    matches2 = matches2.filter((p2) => doesMatch(ptr, p2));
    if (matches2.length === 0) {
      res.push({ passthrough: ptr });
      return;
    }
    matches2 = matches2.sort((a2, b) => a2[1] - b[1]);
    let carry = ptr;
    matches2.forEach((p2, i2) => {
      let found = pivotBy(carry, p2);
      if (!matches2[i2 + 1]) {
        res.push(found);
      } else {
        res.push({ before: found.before, match: found.match });
        if (found.after) {
          carry = found.after;
        }
      }
    });
  });
  return res;
};
var splitAll$1 = splitAll;
const max$1 = 20;
const blindSweep = function(id, doc, n2) {
  for (let i2 = 0; i2 < max$1; i2 += 1) {
    if (doc[n2 - i2]) {
      let index2 = doc[n2 - i2].findIndex((term) => term.id === id);
      if (index2 !== -1) {
        return [n2 - i2, index2];
      }
    }
    if (doc[n2 + i2]) {
      let index2 = doc[n2 + i2].findIndex((term) => term.id === id);
      if (index2 !== -1) {
        return [n2 + i2, index2];
      }
    }
  }
  return null;
};
const repairEnding = function(ptr, document2) {
  let [n2, start2, , , endId] = ptr;
  let terms = document2[n2];
  let newEnd = terms.findIndex((t2) => t2.id === endId);
  if (newEnd === -1) {
    ptr[2] = document2[n2].length;
    ptr[4] = terms.length ? terms[terms.length - 1].id : null;
  } else {
    ptr[2] = newEnd;
  }
  return document2[n2].slice(start2, ptr[2] + 1);
};
const getDoc$1 = function(ptrs, document2) {
  let doc = [];
  ptrs.forEach((ptr, i2) => {
    if (!ptr) {
      return;
    }
    let [n2, start2, end2, id, endId] = ptr;
    let terms = document2[n2] || [];
    if (start2 === void 0) {
      start2 = 0;
    }
    if (end2 === void 0) {
      end2 = terms.length;
    }
    if (id && (!terms[start2] || terms[start2].id !== id)) {
      let wild = blindSweep(id, document2, n2);
      if (wild !== null) {
        let len = end2 - start2;
        terms = document2[wild[0]].slice(wild[1], wild[1] + len);
        let startId = terms[0] ? terms[0].id : null;
        ptrs[i2] = [wild[0], wild[1], wild[1] + len, startId];
      }
    } else {
      terms = terms.slice(start2, end2);
    }
    if (terms.length === 0) {
      return;
    }
    if (start2 === end2) {
      return;
    }
    if (endId && terms[terms.length - 1].id !== endId) {
      terms = repairEnding(ptr, document2);
    }
    doc.push(terms);
  });
  doc = doc.filter((a2) => a2.length > 0);
  return doc;
};
var getDoc$2 = getDoc$1;
const termList = function(docs) {
  let arr = [];
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      arr.push(docs[i2][t2]);
    }
  }
  return arr;
};
var methods$7 = {
  one: {
    termList,
    getDoc: getDoc$2,
    pointer: {
      indexN,
      splitAll: splitAll$1
    }
  }
};
const getUnion = function(a2, b) {
  let both = a2.concat(b);
  let byN = indexN(both);
  let res = [];
  both.forEach((ptr) => {
    let [n2] = ptr;
    if (byN[n2].length === 1) {
      res.push(ptr);
      return;
    }
    let hmm = byN[n2].filter((m2) => doesOverlap(ptr, m2));
    hmm.push(ptr);
    let range = getExtent(hmm);
    res.push(range);
  });
  res = uniquePtrs(res);
  return res;
};
var getUnion$1 = getUnion;
const subtract = function(refs, not) {
  let res = [];
  let found = splitAll$1(refs, not);
  found.forEach((o2) => {
    if (o2.passthrough) {
      res.push(o2.passthrough);
    }
    if (o2.before) {
      res.push(o2.before);
    }
    if (o2.after) {
      res.push(o2.after);
    }
  });
  return res;
};
var getDifference = subtract;
const intersection = function(a2, b) {
  let start2 = a2[1] < b[1] ? b[1] : a2[1];
  let end2 = a2[2] > b[2] ? b[2] : a2[2];
  if (start2 < end2) {
    return [a2[0], start2, end2];
  }
  return null;
};
const getIntersection = function(a2, b) {
  let byN = indexN(b);
  let res = [];
  a2.forEach((ptr) => {
    let hmm = byN[ptr[0]] || [];
    hmm = hmm.filter((p2) => doesOverlap(ptr, p2));
    if (hmm.length === 0) {
      return;
    }
    hmm.forEach((h2) => {
      let overlap = intersection(ptr, h2);
      if (overlap) {
        res.push(overlap);
      }
    });
  });
  return res;
};
var getIntersection$1 = getIntersection;
const isArray$3 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const getDoc = (m2, view) => {
  if (typeof m2 === "string" || isArray$3(m2)) {
    return view.match(m2);
  }
  if (!m2) {
    return view.none();
  }
  return m2;
};
const addIds = function(ptrs, docs) {
  return ptrs.map((ptr) => {
    let [n2, start2] = ptr;
    if (docs[n2] && docs[n2][start2]) {
      ptr[3] = docs[n2][start2].id;
    }
    return ptr;
  });
};
const methods$6 = {};
methods$6.union = function(m2) {
  m2 = getDoc(m2, this);
  let ptrs = getUnion$1(this.fullPointer, m2.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs);
};
methods$6.and = methods$6.union;
methods$6.intersection = function(m2) {
  m2 = getDoc(m2, this);
  let ptrs = getIntersection$1(this.fullPointer, m2.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs);
};
methods$6.not = function(m2) {
  m2 = getDoc(m2, this);
  let ptrs = getDifference(this.fullPointer, m2.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs);
};
methods$6.difference = methods$6.not;
methods$6.complement = function() {
  let doc = this.all();
  let ptrs = getDifference(doc.fullPointer, this.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs);
};
methods$6.settle = function() {
  let ptrs = this.fullPointer;
  ptrs.forEach((ptr) => {
    ptrs = getUnion$1(ptrs, [ptr]);
  });
  ptrs = addIds(ptrs, this.document);
  return this.update(ptrs);
};
const addAPI = function(View2) {
  Object.assign(View2.prototype, methods$6);
};
var api$w = addAPI;
var pointers = {
  methods: methods$7,
  api: api$w
};
var lib$2 = {
  buildNet: function(matches2) {
    const methods2 = this.methods();
    let net2 = methods2.one.buildNet(matches2, this.world());
    net2.isNet = true;
    return net2;
  }
};
const api$u = function(View2) {
  View2.prototype.sweep = function(net2, opts2 = {}) {
    const { world: world2, docs } = this;
    const { methods: methods2 } = world2;
    let found = methods2.one.bulkMatch(docs, net2, this.methods, opts2);
    if (opts2.tagger !== false) {
      methods2.one.bulkTagger(found, docs, this.world);
    }
    found = found.map((o2) => {
      let ptr = o2.pointer;
      let term = docs[ptr[0]][ptr[1]];
      let len = ptr[2] - ptr[1];
      if (term.index) {
        o2.pointer = [
          term.index[0],
          term.index[1],
          ptr[1] + len
        ];
      }
      return o2;
    });
    let ptrs = found.map((o2) => o2.pointer);
    found = found.map((obj) => {
      obj.view = this.update([obj.pointer]);
      delete obj.regs;
      delete obj.needs;
      delete obj.pointer;
      delete obj._expanded;
      return obj;
    });
    return {
      view: this.update(ptrs),
      found
    };
  };
};
var api$v = api$u;
const getTokenNeeds = function(reg) {
  if (reg.optional === true || reg.negative === true) {
    return null;
  }
  if (reg.tag) {
    return "#" + reg.tag;
  }
  if (reg.word) {
    return reg.word;
  }
  if (reg.switch) {
    return `%${reg.switch}%`;
  }
  return null;
};
const getNeeds = function(regs) {
  let needs = [];
  regs.forEach((reg) => {
    needs.push(getTokenNeeds(reg));
    if (reg.operator === "and" && reg.choices) {
      reg.choices.forEach((oneSide) => {
        oneSide.forEach((r2) => {
          needs.push(getTokenNeeds(r2));
        });
      });
    }
  });
  return needs.filter((str) => str);
};
const getWants = function(regs) {
  let wants = [];
  let count = 0;
  regs.forEach((reg) => {
    if (reg.operator === "or" && !reg.optional && !reg.negative) {
      if (reg.fastOr) {
        Array.from(reg.fastOr).forEach((w) => {
          wants.push(w);
        });
      }
      if (reg.choices) {
        reg.choices.forEach((rs) => {
          rs.forEach((r2) => {
            let n2 = getTokenNeeds(r2);
            if (n2) {
              wants.push(n2);
            }
          });
        });
      }
      count += 1;
    }
  });
  return { wants, count };
};
const parse$8 = function(matches2, world2) {
  const parseMatch2 = world2.methods.one.parseMatch;
  matches2.forEach((obj) => {
    obj.regs = parseMatch2(obj.match, {}, world2);
    if (typeof obj.ifNo === "string") {
      obj.ifNo = [obj.ifNo];
    }
    if (obj.notIf) {
      obj.notIf = parseMatch2(obj.notIf, {}, world2);
    }
    obj.needs = getNeeds(obj.regs);
    let { wants, count } = getWants(obj.regs);
    obj.wants = wants;
    obj.minWant = count;
    obj.minWords = obj.regs.filter((o2) => !o2.optional).length;
  });
  return matches2;
};
var parse$9 = parse$8;
const buildNet = function(matches2, world2) {
  matches2 = parse$9(matches2, world2);
  let hooks2 = {};
  matches2.forEach((obj) => {
    obj.needs.forEach((str) => {
      hooks2[str] = hooks2[str] || [];
      hooks2[str].push(obj);
    });
    obj.wants.forEach((str) => {
      hooks2[str] = hooks2[str] || [];
      hooks2[str].push(obj);
    });
  });
  Object.keys(hooks2).forEach((k2) => {
    let already = {};
    hooks2[k2] = hooks2[k2].filter((obj) => {
      if (already[obj.match]) {
        return false;
      }
      already[obj.match] = true;
      return true;
    });
  });
  let always = matches2.filter((o2) => o2.needs.length === 0 && o2.wants.length === 0);
  return {
    hooks: hooks2,
    always
  };
};
var buildNet$1 = buildNet;
const getHooks = function(docCaches, hooks2) {
  return docCaches.map((set, i2) => {
    let maybe = [];
    Object.keys(hooks2).forEach((k2) => {
      if (docCaches[i2].has(k2)) {
        maybe = maybe.concat(hooks2[k2]);
      }
    });
    let already = {};
    maybe = maybe.filter((m2) => {
      if (already[m2.match]) {
        return false;
      }
      already[m2.match] = true;
      return true;
    });
    return maybe;
  });
};
var getHooks$1 = getHooks;
const localTrim = function(maybeList, docCache) {
  return maybeList.map((list2, n2) => {
    let haves = docCache[n2];
    list2 = list2.filter((obj) => {
      return obj.needs.every((need) => haves.has(need));
    });
    list2 = list2.filter((obj) => {
      if (obj.ifNo !== void 0 && obj.ifNo.some((no) => haves.has(no)) === true) {
        return false;
      }
      return true;
    });
    list2 = list2.filter((obj) => {
      if (obj.wants.length === 0) {
        return true;
      }
      let found = obj.wants.filter((str) => haves.has(str)).length;
      return found >= obj.minWant;
    });
    return list2;
  });
};
var trimDown = localTrim;
const runMatch = function(maybeList, document2, docCache, methods2, opts2) {
  let results = [];
  for (let n2 = 0; n2 < maybeList.length; n2 += 1) {
    for (let i2 = 0; i2 < maybeList[n2].length; i2 += 1) {
      let m2 = maybeList[n2][i2];
      let res = methods2.one.match([document2[n2]], m2);
      if (res.ptrs.length > 0) {
        res.ptrs.forEach((ptr) => {
          ptr[0] = n2;
          let todo = Object.assign({}, m2, { pointer: ptr });
          if (m2.unTag !== void 0) {
            todo.unTag = m2.unTag;
          }
          results.push(todo);
        });
        if (opts2.matchOne === true) {
          return [results[0]];
        }
      }
    }
  }
  return results;
};
var runMatch$1 = runMatch;
const tooSmall = function(maybeList, document2) {
  return maybeList.map((arr, i2) => {
    let termCount = document2[i2].length;
    arr = arr.filter((o2) => {
      return termCount >= o2.minWords;
    });
    return arr;
  });
};
const sweep$1 = function(document2, net2, methods2, opts2 = {}) {
  let docCache = methods2.one.cacheDoc(document2);
  let maybeList = getHooks$1(docCache, net2.hooks);
  maybeList = trimDown(maybeList, docCache);
  if (net2.always.length > 0) {
    maybeList = maybeList.map((arr) => arr.concat(net2.always));
  }
  maybeList = tooSmall(maybeList, document2);
  let results = runMatch$1(maybeList, document2, docCache, methods2, opts2);
  return results;
};
var bulkMatch = sweep$1;
const canBe = function(terms, tag2, model2) {
  let tagSet = model2.one.tagSet;
  if (!tagSet.hasOwnProperty(tag2)) {
    return true;
  }
  let not = tagSet[tag2].not || [];
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    let term = terms[i2];
    for (let k2 = 0; k2 < not.length; k2 += 1) {
      if (term.tags.has(not[k2]) === true) {
        return false;
      }
    }
  }
  return true;
};
var canBe$1 = canBe;
const tagger$1 = function(list2, document2, world2) {
  const { model: model2, methods: methods2 } = world2;
  const { getDoc: getDoc2, setTag: setTag2, unTag: unTag2 } = methods2.one;
  const looksPlural2 = methods2.two.looksPlural;
  if (list2.length === 0) {
    return list2;
  }
  const env2 = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
  if (env2.DEBUG_TAGS) {
    console.log(`

  \x1B[32m\u2192 ${list2.length} post-tagger:\x1B[0m`);
  }
  return list2.map((todo) => {
    if (!todo.tag && !todo.chunk && !todo.unTag) {
      return;
    }
    let reason = todo.reason || todo.match;
    let terms = getDoc2([todo.pointer], document2)[0];
    if (todo.safe === true) {
      if (canBe$1(terms, todo.tag, model2) === false) {
        return;
      }
      if (terms[terms.length - 1].post === "-") {
        return;
      }
    }
    if (todo.tag !== void 0) {
      setTag2(terms, todo.tag, world2, todo.safe, `[post] '${reason}'`);
      if (todo.tag === "Noun" && looksPlural2) {
        let term = terms[terms.length - 1];
        if (looksPlural2(term.text)) {
          setTag2([term], "Plural", world2, todo.safe, "quick-plural");
        } else {
          setTag2([term], "Singular", world2, todo.safe, "quick-singular");
        }
      }
    }
    if (todo.unTag !== void 0) {
      unTag2(terms, todo.unTag, world2, todo.safe, reason);
    }
    if (todo.chunk) {
      terms.forEach((t2) => t2.chunk = todo.chunk);
    }
  });
};
var bulkTagger = tagger$1;
var methods$5 = {
  buildNet: buildNet$1,
  bulkMatch,
  bulkTagger
};
var sweep = {
  lib: lib$2,
  api: api$v,
  methods: {
    one: methods$5
  }
};
const isMulti = / /;
const addChunk = function(term, tag2) {
  if (tag2 === "Noun") {
    term.chunk = tag2;
  }
  if (tag2 === "Verb") {
    term.chunk = tag2;
  }
};
const tagTerm = function(term, tag2, tagSet, isSafe) {
  if (term.tags.has(tag2) === true) {
    return null;
  }
  if (tag2 === ".") {
    return null;
  }
  let known = tagSet[tag2];
  if (known) {
    if (known.not && known.not.length > 0) {
      for (let o2 = 0; o2 < known.not.length; o2 += 1) {
        if (isSafe === true && term.tags.has(known.not[o2])) {
          return null;
        }
        term.tags.delete(known.not[o2]);
      }
    }
    if (known.parents && known.parents.length > 0) {
      for (let o2 = 0; o2 < known.parents.length; o2 += 1) {
        term.tags.add(known.parents[o2]);
        addChunk(term, known.parents[o2]);
      }
    }
  }
  term.tags.add(tag2);
  term.dirty = true;
  addChunk(term, tag2);
  return true;
};
const multiTag = function(terms, tagString2, tagSet, isSafe) {
  let tags2 = tagString2.split(isMulti);
  terms.forEach((term, i2) => {
    let tag2 = tags2[i2];
    if (tag2) {
      tag2 = tag2.replace(/^#/, "");
      tagTerm(term, tag2, tagSet, isSafe);
    }
  });
};
const isArray$2 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const log$1 = (terms, tag2, reason = "") => {
  const yellow = (str) => "\x1B[33m\x1B[3m" + str + "\x1B[0m";
  const i2 = (str) => "\x1B[3m" + str + "\x1B[0m";
  let word = terms.map((t2) => {
    return t2.text || "[" + t2.implicit + "]";
  }).join(" ");
  if (typeof tag2 !== "string" && tag2.length > 2) {
    tag2 = tag2.slice(0, 2).join(", #") + " +";
  }
  tag2 = typeof tag2 !== "string" ? tag2.join(", #") : tag2;
  console.log(` ${yellow(word).padEnd(24)} \x1B[32m\u2192\x1B[0m #${tag2.padEnd(22)}  ${i2(reason)}`);
};
const setTag$1 = function(terms, tag2, world2 = {}, isSafe, reason) {
  const tagSet = world2.model.one.tagSet || {};
  if (!tag2) {
    return;
  }
  const env2 = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
  if (env2 && env2.DEBUG_TAGS) {
    log$1(terms, tag2, reason);
  }
  if (isArray$2(tag2) === true) {
    tag2.forEach((tg) => setTag$1(terms, tg, world2, isSafe));
    return;
  }
  if (typeof tag2 !== "string") {
    console.warn(`compromise: Invalid tag '${tag2}'`);
    return;
  }
  tag2 = tag2.trim();
  if (isMulti.test(tag2)) {
    multiTag(terms, tag2, tagSet, isSafe);
    return;
  }
  tag2 = tag2.replace(/^#/, "");
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    tagTerm(terms[i2], tag2, tagSet, isSafe);
  }
};
var setTag$2 = setTag$1;
const unTag = function(terms, tag2, tagSet) {
  tag2 = tag2.trim().replace(/^#/, "");
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    let term = terms[i2];
    if (tag2 === "*") {
      term.tags.clear();
      continue;
    }
    let known = tagSet[tag2];
    if (known && known.children.length > 0) {
      for (let o2 = 0; o2 < known.children.length; o2 += 1) {
        term.tags.delete(known.children[o2]);
      }
    }
    term.tags.delete(tag2);
  }
};
var unTag$1 = unTag;
const e = function(e2) {
  return e2.children = e2.children || [], e2._cache = e2._cache || {}, e2.props = e2.props || {}, e2._cache.parents = e2._cache.parents || [], e2._cache.children = e2._cache.children || [], e2;
}, t = /^ *(#|\/\/)/, n$1 = function(t2) {
  let n2 = t2.trim().split(/->/), r2 = [];
  n2.forEach((t3) => {
    r2 = r2.concat(function(t4) {
      if (!(t4 = t4.trim()))
        return null;
      if (/^\[/.test(t4) && /\]$/.test(t4)) {
        let n3 = (t4 = (t4 = t4.replace(/^\[/, "")).replace(/\]$/, "")).split(/,/);
        return n3 = n3.map((e2) => e2.trim()).filter((e2) => e2), n3 = n3.map((t5) => e({ id: t5 })), n3;
      }
      return [e({ id: t4 })];
    }(t3));
  }), r2 = r2.filter((e2) => e2);
  let i2 = r2[0];
  for (let e2 = 1; e2 < r2.length; e2 += 1)
    i2.children.push(r2[e2]), i2 = r2[e2];
  return r2[0];
}, r = (e2, t2) => {
  let n2 = [], r2 = [e2];
  for (; r2.length > 0; ) {
    let e3 = r2.pop();
    n2.push(e3), e3.children && e3.children.forEach((n3) => {
      t2 && t2(e3, n3), r2.push(n3);
    });
  }
  return n2;
}, i = (e2) => "[object Array]" === Object.prototype.toString.call(e2), c = (e2) => (e2 = e2 || "").trim(), s$1 = function(c2 = []) {
  return "string" == typeof c2 ? function(r2) {
    let i2 = r2.split(/\r?\n/), c3 = [];
    i2.forEach((e2) => {
      if (!e2.trim() || t.test(e2))
        return;
      let r3 = ((e3) => {
        const t2 = /^( {2}|\t)/;
        let n2 = 0;
        for (; t2.test(e3); )
          e3 = e3.replace(t2, ""), n2 += 1;
        return n2;
      })(e2);
      c3.push({ indent: r3, node: n$1(e2) });
    });
    let s3 = function(e2) {
      let t2 = { children: [] };
      return e2.forEach((n2, r3) => {
        0 === n2.indent ? t2.children = t2.children.concat(n2.node) : e2[r3 - 1] && function(e3, t3) {
          let n3 = e3[t3].indent;
          for (; t3 >= 0; t3 -= 1)
            if (e3[t3].indent < n3)
              return e3[t3];
          return e3[0];
        }(e2, r3).node.children.push(n2.node);
      }), t2;
    }(c3);
    return s3 = e(s3), s3;
  }(c2) : i(c2) ? function(t2) {
    let n2 = {};
    t2.forEach((e2) => {
      n2[e2.id] = e2;
    });
    let r2 = e({});
    return t2.forEach((t3) => {
      if ((t3 = e(t3)).parent)
        if (n2.hasOwnProperty(t3.parent)) {
          let e2 = n2[t3.parent];
          delete t3.parent, e2.children.push(t3);
        } else
          console.warn(`[Grad] - missing node '${t3.parent}'`);
      else
        r2.children.push(t3);
    }), r2;
  }(c2) : (r(s2 = c2).forEach(e), s2);
  var s2;
}, h = (e2) => "\x1B[31m" + e2 + "\x1B[0m", o = (e2) => "\x1B[2m" + e2 + "\x1B[0m", l = function(e2, t2) {
  let n2 = "-> ";
  t2 && (n2 = o("\u2192 "));
  let i2 = "";
  return r(e2).forEach((e3, r2) => {
    let c2 = e3.id || "";
    if (t2 && (c2 = h(c2)), 0 === r2 && !e3.id)
      return;
    let s2 = e3._cache.parents.length;
    i2 += "    ".repeat(s2) + n2 + c2 + "\n";
  }), i2;
}, a = function(e2) {
  let t2 = r(e2);
  t2.forEach((e3) => {
    delete (e3 = Object.assign({}, e3)).children;
  });
  let n2 = t2[0];
  return n2 && !n2.id && 0 === Object.keys(n2.props).length && t2.shift(), t2;
}, p$3 = { text: l, txt: l, array: a, flat: a }, d = function(e2, t2) {
  return "nested" === t2 || "json" === t2 ? e2 : "debug" === t2 ? (console.log(l(e2, true)), null) : p$3.hasOwnProperty(t2) ? p$3[t2](e2) : e2;
}, u = (e2) => {
  r(e2, (e3, t2) => {
    e3.id && (e3._cache.parents = e3._cache.parents || [], t2._cache.parents = e3._cache.parents.concat([e3.id]));
  });
}, f$1 = (e2, t2) => (Object.keys(t2).forEach((n2) => {
  if (t2[n2] instanceof Set) {
    let r2 = e2[n2] || /* @__PURE__ */ new Set();
    e2[n2] = /* @__PURE__ */ new Set([...r2, ...t2[n2]]);
  } else {
    if (((e3) => e3 && "object" == typeof e3 && !Array.isArray(e3))(t2[n2])) {
      let r2 = e2[n2] || {};
      e2[n2] = Object.assign({}, t2[n2], r2);
    } else
      i(t2[n2]) ? e2[n2] = t2[n2].concat(e2[n2] || []) : void 0 === e2[n2] && (e2[n2] = t2[n2]);
  }
}), e2), j = /\//;
class g$1 {
  constructor(e2 = {}) {
    Object.defineProperty(this, "json", { enumerable: false, value: e2, writable: true });
  }
  get children() {
    return this.json.children;
  }
  get id() {
    return this.json.id;
  }
  get found() {
    return this.json.id || this.json.children.length > 0;
  }
  props(e2 = {}) {
    let t2 = this.json.props || {};
    return "string" == typeof e2 && (t2[e2] = true), this.json.props = Object.assign(t2, e2), this;
  }
  get(t2) {
    if (t2 = c(t2), !j.test(t2)) {
      let e2 = this.json.children.find((e3) => e3.id === t2);
      return new g$1(e2);
    }
    let n2 = ((e2, t3) => {
      let n3 = ((e3) => "string" != typeof e3 ? e3 : (e3 = e3.replace(/^\//, "")).split(/\//))(t3 = t3 || "");
      for (let t4 = 0; t4 < n3.length; t4 += 1) {
        let r2 = e2.children.find((e3) => e3.id === n3[t4]);
        if (!r2)
          return null;
        e2 = r2;
      }
      return e2;
    })(this.json, t2) || e({});
    return new g$1(n2);
  }
  add(t2, n2 = {}) {
    if (i(t2))
      return t2.forEach((e2) => this.add(c(e2), n2)), this;
    t2 = c(t2);
    let r2 = e({ id: t2, props: n2 });
    return this.json.children.push(r2), new g$1(r2);
  }
  remove(e2) {
    return e2 = c(e2), this.json.children = this.json.children.filter((t2) => t2.id !== e2), this;
  }
  nodes() {
    return r(this.json).map((e2) => (delete (e2 = Object.assign({}, e2)).children, e2));
  }
  cache() {
    return ((e2) => {
      let t2 = r(e2, (e3, t3) => {
        e3.id && (e3._cache.parents = e3._cache.parents || [], e3._cache.children = e3._cache.children || [], t3._cache.parents = e3._cache.parents.concat([e3.id]));
      }), n2 = {};
      t2.forEach((e3) => {
        e3.id && (n2[e3.id] = e3);
      }), t2.forEach((e3) => {
        e3._cache.parents.forEach((t3) => {
          n2.hasOwnProperty(t3) && n2[t3]._cache.children.push(e3.id);
        });
      }), e2._cache.children = Object.keys(n2);
    })(this.json), this;
  }
  list() {
    return r(this.json);
  }
  fillDown() {
    var e2;
    return e2 = this.json, r(e2, (e3, t2) => {
      t2.props = f$1(t2.props, e3.props);
    }), this;
  }
  depth() {
    u(this.json);
    let e2 = r(this.json), t2 = e2.length > 1 ? 1 : 0;
    return e2.forEach((e3) => {
      if (0 === e3._cache.parents.length)
        return;
      let n2 = e3._cache.parents.length + 1;
      n2 > t2 && (t2 = n2);
    }), t2;
  }
  out(e2) {
    return u(this.json), d(this.json, e2);
  }
  debug() {
    return u(this.json), d(this.json, "debug"), this;
  }
}
const _ = function(e2) {
  let t2 = s$1(e2);
  return new g$1(t2);
};
_.prototype.plugin = function(e2) {
  e2(this);
};
const colors = {
  Noun: "blue",
  Verb: "green",
  Negative: "green",
  Date: "red",
  Value: "red",
  Adjective: "magenta",
  Preposition: "cyan",
  Conjunction: "cyan",
  Determiner: "cyan",
  Hyphenated: "cyan",
  Adverb: "cyan"
};
var colors$1 = colors;
const getColor = function(node) {
  if (colors$1.hasOwnProperty(node.id)) {
    return colors$1[node.id];
  }
  if (colors$1.hasOwnProperty(node.is)) {
    return colors$1[node.is];
  }
  let found = node._cache.parents.find((c2) => colors$1[c2]);
  return colors$1[found];
};
const fmt = function(nodes) {
  const res = {};
  nodes.forEach((node) => {
    let { not, also, is, novel } = node.props;
    let parents = node._cache.parents;
    if (also) {
      parents = parents.concat(also);
    }
    res[node.id] = {
      is,
      not,
      novel,
      also,
      parents,
      children: node._cache.children,
      color: getColor(node)
    };
  });
  Object.keys(res).forEach((k2) => {
    let nots = new Set(res[k2].not);
    res[k2].not.forEach((not) => {
      if (res[not]) {
        res[not].children.forEach((tag2) => nots.add(tag2));
      }
    });
    res[k2].not = Array.from(nots);
  });
  return res;
};
var fmt$1 = fmt;
const toArr = function(input) {
  if (!input) {
    return [];
  }
  if (typeof input === "string") {
    return [input];
  }
  return input;
};
const addImplied = function(tags2, already) {
  Object.keys(tags2).forEach((k2) => {
    if (tags2[k2].isA) {
      tags2[k2].is = tags2[k2].isA;
    }
    if (tags2[k2].notA) {
      tags2[k2].not = tags2[k2].notA;
    }
    if (tags2[k2].is && typeof tags2[k2].is === "string") {
      if (!already.hasOwnProperty(tags2[k2].is) && !tags2.hasOwnProperty(tags2[k2].is)) {
        tags2[tags2[k2].is] = {};
      }
    }
    if (tags2[k2].not && typeof tags2[k2].not === "string" && !tags2.hasOwnProperty(tags2[k2].not)) {
      if (!already.hasOwnProperty(tags2[k2].not) && !tags2.hasOwnProperty(tags2[k2].not)) {
        tags2[tags2[k2].not] = {};
      }
    }
  });
  return tags2;
};
const validate = function(tags2, already) {
  tags2 = addImplied(tags2, already);
  Object.keys(tags2).forEach((k2) => {
    tags2[k2].children = toArr(tags2[k2].children);
    tags2[k2].not = toArr(tags2[k2].not);
  });
  Object.keys(tags2).forEach((k2) => {
    let nots = tags2[k2].not || [];
    nots.forEach((no) => {
      if (tags2[no] && tags2[no].not) {
        tags2[no].not.push(k2);
      }
    });
  });
  return tags2;
};
var validate$1 = validate;
const compute$7 = function(allTags2) {
  const flatList = Object.keys(allTags2).map((k2) => {
    let o2 = allTags2[k2];
    const props = { not: new Set(o2.not), also: o2.also, is: o2.is, novel: o2.novel };
    return { id: k2, parent: o2.is, props, children: [] };
  });
  const graph = _(flatList).cache().fillDown();
  return graph.out("array");
};
const fromUser = function(tags2) {
  Object.keys(tags2).forEach((k2) => {
    tags2[k2] = Object.assign({}, tags2[k2]);
    tags2[k2].novel = true;
  });
  return tags2;
};
const addTags$1 = function(tags2, already) {
  if (Object.keys(already).length > 0) {
    tags2 = fromUser(tags2);
  }
  tags2 = validate$1(tags2, already);
  let allTags2 = Object.assign({}, already, tags2);
  const nodes = compute$7(allTags2);
  const res = fmt$1(nodes);
  return res;
};
var addTags$2 = addTags$1;
var methods$4 = {
  one: {
    setTag: setTag$2,
    unTag: unTag$1,
    addTags: addTags$2
  }
};
const isArray$1 = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const fns$1 = {
  tag: function(input, reason = "", isSafe) {
    if (!this.found || !input) {
      return this;
    }
    let terms = this.termList();
    if (terms.length === 0) {
      return this;
    }
    const { methods: methods2, verbose: verbose2, world: world2 } = this;
    if (verbose2 === true) {
      console.log(" +  ", input, reason || "");
    }
    if (isArray$1(input)) {
      input.forEach((tag2) => methods2.one.setTag(terms, tag2, world2, isSafe, reason));
    } else {
      methods2.one.setTag(terms, input, world2, isSafe, reason);
    }
    this.uncache();
    return this;
  },
  tagSafe: function(input, reason = "") {
    return this.tag(input, reason, true);
  },
  unTag: function(input, reason) {
    if (!this.found || !input) {
      return this;
    }
    let terms = this.termList();
    if (terms.length === 0) {
      return this;
    }
    const { methods: methods2, verbose: verbose2, model: model2 } = this;
    if (verbose2 === true) {
      console.log(" -  ", input, reason || "");
    }
    let tagSet = model2.one.tagSet;
    if (isArray$1(input)) {
      input.forEach((tag2) => methods2.one.unTag(terms, tag2, tagSet));
    } else {
      methods2.one.unTag(terms, input, tagSet);
    }
    this.uncache();
    return this;
  },
  canBe: function(tag2) {
    tag2 = tag2.replace(/^#/, "");
    let tagSet = this.model.one.tagSet;
    if (!tagSet.hasOwnProperty(tag2)) {
      return this;
    }
    let not = tagSet[tag2].not || [];
    let nope2 = [];
    this.document.forEach((terms, n2) => {
      terms.forEach((term, i2) => {
        let found = not.find((no) => term.tags.has(no));
        if (found) {
          nope2.push([n2, i2, i2 + 1]);
        }
      });
    });
    let noDoc = this.update(nope2);
    return this.difference(noDoc);
  }
};
var tag$1 = fns$1;
const tagAPI = function(View2) {
  Object.assign(View2.prototype, tag$1);
};
var api$t = tagAPI;
const addTags = function(tags2) {
  const { model: model2, methods: methods2 } = this.world();
  const tagSet = model2.one.tagSet;
  const fn = methods2.one.addTags;
  let res = fn(tags2, tagSet);
  model2.one.tagSet = res;
  return this;
};
var lib$1 = { addTags };
const boringTags = /* @__PURE__ */ new Set(["Auxiliary", "Possessive"]);
const sortByKids = function(tags2, tagSet) {
  tags2 = tags2.sort((a2, b) => {
    if (boringTags.has(a2) || !tagSet.hasOwnProperty(b)) {
      return 1;
    }
    if (boringTags.has(b) || !tagSet.hasOwnProperty(a2)) {
      return -1;
    }
    let kids = tagSet[a2].children || [];
    let aKids = kids.length;
    kids = tagSet[b].children || [];
    let bKids = kids.length;
    return aKids - bKids;
  });
  return tags2;
};
const tagRank = function(view) {
  const { document: document2, world: world2 } = view;
  const tagSet = world2.model.one.tagSet;
  document2.forEach((terms) => {
    terms.forEach((term) => {
      let tags2 = Array.from(term.tags);
      term.tagRank = sortByKids(tags2, tagSet);
    });
  });
};
var tagRank$1 = tagRank;
var tag = {
  model: {
    one: { tagSet: {} }
  },
  compute: {
    tagRank: tagRank$1
  },
  methods: methods$4,
  api: api$t,
  lib: lib$1
};
const initSplit = /([.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s)/g;
const splitsOnly = /^[.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s$/;
const newLine = /((?:\r?\n|\r)+)/;
const basicSplit = function(text2) {
  let all2 = [];
  let lines = text2.split(newLine);
  for (let i2 = 0; i2 < lines.length; i2++) {
    let arr = lines[i2].split(initSplit);
    for (let o2 = 0; o2 < arr.length; o2++) {
      if (arr[o2 + 1] && splitsOnly.test(arr[o2 + 1]) === true) {
        arr[o2] += arr[o2 + 1];
        arr[o2 + 1] = "";
      }
      if (arr[o2] !== "") {
        all2.push(arr[o2]);
      }
    }
  }
  return all2;
};
var simpleSplit = basicSplit;
const hasLetter$1 = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i;
const hasSomething$1 = /\S/;
const notEmpty = function(splits) {
  let chunks2 = [];
  for (let i2 = 0; i2 < splits.length; i2++) {
    let s2 = splits[i2];
    if (s2 === void 0 || s2 === "") {
      continue;
    }
    if (hasSomething$1.test(s2) === false || hasLetter$1.test(s2) === false) {
      if (chunks2[chunks2.length - 1]) {
        chunks2[chunks2.length - 1] += s2;
        continue;
      } else if (splits[i2 + 1]) {
        splits[i2 + 1] = s2 + splits[i2 + 1];
        continue;
      }
    }
    chunks2.push(s2);
  }
  return chunks2;
};
var simpleMerge = notEmpty;
const smartMerge = function(chunks2, world2) {
  const isSentence2 = world2.methods.one.tokenize.isSentence;
  const abbrevs = world2.model.one.abbreviations || /* @__PURE__ */ new Set();
  let sentences2 = [];
  for (let i2 = 0; i2 < chunks2.length; i2++) {
    let c2 = chunks2[i2];
    if (chunks2[i2 + 1] && isSentence2(c2, abbrevs) === false) {
      chunks2[i2 + 1] = c2 + (chunks2[i2 + 1] || "");
    } else if (c2 && c2.length > 0) {
      sentences2.push(c2);
      chunks2[i2] = "";
    }
  }
  return sentences2;
};
var smartMerge$1 = smartMerge;
const MAX_QUOTE = 280;
const pairs$1 = {
  '"': '"',
  "\uFF02": "\uFF02",
  "\u201C": "\u201D",
  "\u201F": "\u201D",
  "\u201E": "\u201D",
  "\u2E42": "\u201D",
  "\u201A": "\u2019",
  "\xAB": "\xBB",
  "\u2039": "\u203A",
  "\u2035": "\u2032",
  "\u2036": "\u2033",
  "\u2037": "\u2034",
  "\u301D": "\u301E",
  "\u301F": "\u301E"
};
const openQuote = RegExp("[" + Object.keys(pairs$1).join("") + "]", "g");
const closeQuote = RegExp("[" + Object.values(pairs$1).join("") + "]", "g");
const closesQuote = function(str) {
  if (!str) {
    return false;
  }
  let m2 = str.match(closeQuote);
  if (m2 !== null && m2.length === 1) {
    return true;
  }
  return false;
};
const quoteMerge = function(splits) {
  let arr = [];
  for (let i2 = 0; i2 < splits.length; i2 += 1) {
    let split2 = splits[i2];
    let m2 = split2.match(openQuote);
    if (m2 !== null && m2.length === 1) {
      if (closesQuote(splits[i2 + 1]) && splits[i2 + 1].length < MAX_QUOTE) {
        splits[i2] += splits[i2 + 1];
        arr.push(splits[i2]);
        splits[i2 + 1] = "";
        i2 += 1;
        continue;
      }
      if (closesQuote(splits[i2 + 2])) {
        let toAdd = splits[i2 + 1] + splits[i2 + 2];
        if (toAdd.length < MAX_QUOTE) {
          splits[i2] += toAdd;
          arr.push(splits[i2]);
          splits[i2 + 1] = "";
          splits[i2 + 2] = "";
          i2 += 2;
          continue;
        }
      }
    }
    arr.push(splits[i2]);
  }
  return arr;
};
var quoteMerge$1 = quoteMerge;
const MAX_LEN = 250;
const hasOpen$2 = /\(/g;
const hasClosed$2 = /\)/g;
const mergeParens = function(splits) {
  let arr = [];
  for (let i2 = 0; i2 < splits.length; i2 += 1) {
    let split2 = splits[i2];
    let m2 = split2.match(hasOpen$2);
    if (m2 !== null && m2.length === 1) {
      if (splits[i2 + 1] && splits[i2 + 1].length < MAX_LEN) {
        let m22 = splits[i2 + 1].match(hasClosed$2);
        if (m22 !== null && m2.length === 1 && !hasOpen$2.test(splits[i2 + 1])) {
          splits[i2] += splits[i2 + 1];
          arr.push(splits[i2]);
          splits[i2 + 1] = "";
          i2 += 1;
          continue;
        }
      }
    }
    arr.push(splits[i2]);
  }
  return arr;
};
var parensMerge = mergeParens;
const hasSomething = /\S/;
const startWhitespace = /^\s+/;
const splitSentences = function(text2, world2) {
  text2 = text2 || "";
  text2 = String(text2);
  if (!text2 || typeof text2 !== "string" || hasSomething.test(text2) === false) {
    return [];
  }
  text2 = text2.replace("\xA0", " ");
  let splits = simpleSplit(text2);
  let sentences2 = simpleMerge(splits);
  sentences2 = smartMerge$1(sentences2, world2);
  sentences2 = quoteMerge$1(sentences2);
  sentences2 = parensMerge(sentences2);
  if (sentences2.length === 0) {
    return [text2];
  }
  for (let i2 = 1; i2 < sentences2.length; i2 += 1) {
    let ws = sentences2[i2].match(startWhitespace);
    if (ws !== null) {
      sentences2[i2 - 1] += ws[0];
      sentences2[i2] = sentences2[i2].replace(startWhitespace, "");
    }
  }
  return sentences2;
};
var splitSentences$1 = splitSentences;
const hasHyphen = function(str, model2) {
  let parts = str.split(/[-–—]/);
  if (parts.length <= 1) {
    return false;
  }
  const { prefixes: prefixes2, suffixes: suffixes2 } = model2.one;
  if (parts[0].length === 1 && /[a-z]/i.test(parts[0])) {
    return false;
  }
  if (prefixes2.hasOwnProperty(parts[0])) {
    return false;
  }
  parts[1] = parts[1].trim().replace(/[.?!]$/, "");
  if (suffixes2.hasOwnProperty(parts[1])) {
    return false;
  }
  let reg = /^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i;
  if (reg.test(str) === true) {
    return true;
  }
  let reg2 = /^([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+$)/i;
  if (reg2.test(str) === true) {
    return true;
  }
  return false;
};
const splitHyphens = function(word) {
  let arr = [];
  const hyphens2 = word.split(/[-–—]/);
  let whichDash = "-";
  let found = word.match(/[-–—]/);
  if (found && found[0]) {
    whichDash = found;
  }
  for (let o2 = 0; o2 < hyphens2.length; o2++) {
    if (o2 === hyphens2.length - 1) {
      arr.push(hyphens2[o2]);
    } else {
      arr.push(hyphens2[o2] + whichDash);
    }
  }
  return arr;
};
const combineRanges = function(arr) {
  const startRange = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/;
  const endRange = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
  for (let i2 = 0; i2 < arr.length - 1; i2 += 1) {
    if (arr[i2 + 1] && startRange.test(arr[i2]) && endRange.test(arr[i2 + 1])) {
      arr[i2] = arr[i2] + arr[i2 + 1];
      arr[i2 + 1] = null;
    }
  }
  return arr;
};
var combineRanges$1 = combineRanges;
const isSlash = /\p{L} ?\/ ?\p{L}+$/u;
const combineSlashes = function(arr) {
  for (let i2 = 1; i2 < arr.length - 1; i2++) {
    if (isSlash.test(arr[i2])) {
      arr[i2 - 1] += arr[i2] + arr[i2 + 1];
      arr[i2] = null;
      arr[i2 + 1] = null;
    }
  }
  return arr;
};
var combineSlashes$1 = combineSlashes;
const wordlike = /\S/;
const isBoundary = /^[!?.]+$/;
const naiiveSplit = /(\S+)/;
let notWord = [
  ".",
  "?",
  "!",
  ":",
  ";",
  "-",
  "\u2013",
  "\u2014",
  "--",
  "...",
  "(",
  ")",
  "[",
  "]",
  '"',
  "'",
  "`",
  "\xAB",
  "\xBB",
  "*",
  "\u2022"
];
notWord = notWord.reduce((h2, c2) => {
  h2[c2] = true;
  return h2;
}, {});
const isArray = function(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
};
const splitWords = function(str, model2) {
  let result = [];
  let arr = [];
  str = str || "";
  if (typeof str === "number") {
    str = String(str);
  }
  if (isArray(str)) {
    return str;
  }
  const words2 = str.split(naiiveSplit);
  for (let i2 = 0; i2 < words2.length; i2++) {
    if (hasHyphen(words2[i2], model2) === true) {
      arr = arr.concat(splitHyphens(words2[i2]));
      continue;
    }
    arr.push(words2[i2]);
  }
  let carry = "";
  for (let i2 = 0; i2 < arr.length; i2++) {
    let word = arr[i2];
    if (wordlike.test(word) === true && notWord.hasOwnProperty(word) === false && isBoundary.test(word) === false) {
      if (result.length > 0) {
        result[result.length - 1] += carry;
        result.push(word);
      } else {
        result.push(carry + word);
      }
      carry = "";
    } else {
      carry += word;
    }
  }
  if (carry) {
    if (result.length === 0) {
      result[0] = "";
    }
    result[result.length - 1] += carry;
  }
  result = combineSlashes$1(result);
  result = combineRanges$1(result);
  result = result.filter((s2) => s2);
  return result;
};
var splitTerms = splitWords;
const isLetter = /\p{Letter}/u;
const isNumber = /[\p{Number}\p{Currency_Symbol}]/u;
const hasAcronym = /^[a-z]\.([a-z]\.)+/i;
const chillin = /[sn]['’]$/;
const normalizePunctuation = function(str, model2) {
  let { prePunctuation: prePunctuation2, postPunctuation: postPunctuation2, emoticons: emoticons2 } = model2.one;
  let original = str;
  let pre = "";
  let post = "";
  let chars = Array.from(str);
  if (emoticons2.hasOwnProperty(str.trim())) {
    return { str: str.trim(), pre, post: " " };
  }
  let len = chars.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    let c2 = chars[0];
    if (prePunctuation2[c2] === true) {
      continue;
    }
    if ((c2 === "+" || c2 === "-") && isNumber.test(chars[1])) {
      break;
    }
    if (c2 === "'" && c2.length === 3 && isNumber.test(chars[1])) {
      break;
    }
    if (isLetter.test(c2) || isNumber.test(c2)) {
      break;
    }
    pre += chars.shift();
  }
  len = chars.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    let c2 = chars[chars.length - 1];
    if (postPunctuation2[c2] === true) {
      continue;
    }
    if (isLetter.test(c2) || isNumber.test(c2)) {
      break;
    }
    if (c2 === "." && hasAcronym.test(original) === true) {
      continue;
    }
    if (c2 === "'" && chillin.test(original) === true) {
      continue;
    }
    post = chars.pop() + post;
  }
  str = chars.join("");
  if (str === "") {
    original = original.replace(/ *$/, (after2) => {
      post = after2 || "";
      return "";
    });
    str = original;
    pre = "";
  }
  return { str, pre, post };
};
var tokenize$1 = normalizePunctuation;
const parseTerm = (txt, model2) => {
  let { str, pre, post } = tokenize$1(txt, model2);
  const parsed = {
    text: str,
    pre,
    post,
    tags: /* @__PURE__ */ new Set()
  };
  return parsed;
};
var splitWhitespace = parseTerm;
const killUnicode = function(str, world2) {
  const unicode2 = world2.model.one.unicode || {};
  str = str || "";
  let chars = str.split("");
  chars.forEach((s2, i2) => {
    if (unicode2[s2]) {
      chars[i2] = unicode2[s2];
    }
  });
  return chars.join("");
};
var killUnicode$1 = killUnicode;
const clean = function(str) {
  str = str || "";
  str = str.toLowerCase();
  str = str.trim();
  let original = str;
  str = str.replace(/[,;.!?]+$/, "");
  str = str.replace(/\u2026/g, "...");
  str = str.replace(/\u2013/g, "-");
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, "");
    str = str.replace(/[",.!:;?)]+$/g, "");
    str = str.replace(/^['"(]+/g, "");
  }
  str = str.replace(/[\u200B-\u200D\uFEFF]/g, "");
  str = str.trim();
  if (str === "") {
    str = original;
  }
  str = str.replace(/([0-9]),([0-9])/g, "$1$2");
  return str;
};
var cleanup = clean;
const periodAcronym$1 = /([A-Z]\.)+[A-Z]?,?$/;
const oneLetterAcronym$1 = /^[A-Z]\.,?$/;
const noPeriodAcronym$1 = /[A-Z]{2,}('s|,)?$/;
const lowerCaseAcronym$1 = /([a-z]\.)+[a-z]\.?$/;
const isAcronym$2 = function(str) {
  if (periodAcronym$1.test(str) === true) {
    return true;
  }
  if (lowerCaseAcronym$1.test(str) === true) {
    return true;
  }
  if (oneLetterAcronym$1.test(str) === true) {
    return true;
  }
  if (noPeriodAcronym$1.test(str) === true) {
    return true;
  }
  return false;
};
const doAcronym = function(str) {
  if (isAcronym$2(str)) {
    str = str.replace(/\./g, "");
  }
  return str;
};
var doAcronyms = doAcronym;
const normalize$1 = function(term, world2) {
  const killUnicode2 = world2.methods.one.killUnicode;
  let str = term.text || "";
  str = cleanup(str);
  str = killUnicode2(str, world2);
  str = doAcronyms(str);
  term.normal = str;
};
var normal = normalize$1;
const parse$7 = function(input, world2) {
  const { methods: methods2, model: model2 } = world2;
  const { splitSentences: splitSentences2, splitTerms: splitTerms2, splitWhitespace: splitWhitespace2 } = methods2.one.tokenize;
  input = input || "";
  let sentences2 = splitSentences2(input, world2);
  input = sentences2.map((txt) => {
    let terms = splitTerms2(txt, model2);
    terms = terms.map((t2) => splitWhitespace2(t2, model2));
    terms.forEach((t2) => {
      normal(t2, world2);
    });
    return terms;
  });
  return input;
};
var fromString = parse$7;
const isAcronym$1 = /[ .][A-Z]\.? *$/i;
const hasEllipse = /(?:\u2026|\.{2,}) *$/;
const hasLetter = /\p{L}/u;
const leadInit = /^[A-Z]\. $/;
const isSentence = function(str, abbrevs) {
  if (hasLetter.test(str) === false) {
    return false;
  }
  if (isAcronym$1.test(str) === true) {
    return false;
  }
  if (str.length === 3 && leadInit.test(str)) {
    return false;
  }
  if (hasEllipse.test(str) === true) {
    return false;
  }
  let txt = str.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "");
  let words2 = txt.split(" ");
  let lastWord = words2[words2.length - 1].toLowerCase();
  if (abbrevs.hasOwnProperty(lastWord) === true) {
    return false;
  }
  return true;
};
var isSentence$1 = isSentence;
var methods$3 = {
  one: {
    killUnicode: killUnicode$1,
    tokenize: {
      splitSentences: splitSentences$1,
      isSentence: isSentence$1,
      splitTerms,
      splitWhitespace,
      fromString
    }
  }
};
const aliases$1 = {
  "&": "and",
  "@": "at",
  "%": "percent",
  "plz": "please",
  "bein": "being"
};
var aliases$2 = aliases$1;
var misc$8 = [
  "approx",
  "apt",
  "bc",
  "cyn",
  "eg",
  "esp",
  "est",
  "etc",
  "ex",
  "exp",
  "prob",
  "pron",
  "gal",
  "min",
  "pseud",
  "fig",
  "jd",
  "lat",
  "lng",
  "vol",
  "fm",
  "def",
  "misc",
  "plz",
  "ea",
  "ps",
  "sec",
  "pt",
  "pref",
  "pl",
  "pp",
  "qt",
  "fr",
  "sq",
  "nee",
  "ss",
  "tel",
  "temp",
  "vet",
  "ver",
  "fem",
  "masc",
  "eng",
  "adj",
  "vb",
  "rb",
  "inf",
  "situ",
  "vivo",
  "vitro",
  "wr"
];
var honorifics$1 = [
  "adj",
  "adm",
  "adv",
  "asst",
  "atty",
  "bldg",
  "brig",
  "capt",
  "cmdr",
  "comdr",
  "cpl",
  "det",
  "dr",
  "esq",
  "gen",
  "gov",
  "hon",
  "jr",
  "llb",
  "lt",
  "maj",
  "messrs",
  "mlle",
  "mme",
  "mr",
  "mrs",
  "ms",
  "mstr",
  "phd",
  "prof",
  "pvt",
  "rep",
  "reps",
  "res",
  "rev",
  "sen",
  "sens",
  "sfc",
  "sgt",
  "sir",
  "sr",
  "supt",
  "surg"
];
var months = ["jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"];
var nouns$3 = [
  "ad",
  "al",
  "arc",
  "ba",
  "bl",
  "ca",
  "cca",
  "col",
  "corp",
  "ft",
  "fy",
  "ie",
  "lit",
  "ma",
  "md",
  "pd",
  "tce"
];
var organizations = ["dept", "univ", "assn", "bros", "inc", "ltd", "co"];
var places$3 = [
  "rd",
  "st",
  "dist",
  "mt",
  "ave",
  "blvd",
  "cl",
  "cres",
  "hwy",
  "ariz",
  "cal",
  "calif",
  "colo",
  "conn",
  "fla",
  "fl",
  "ga",
  "ida",
  "ia",
  "kan",
  "kans",
  "minn",
  "neb",
  "nebr",
  "okla",
  "penna",
  "penn",
  "pa",
  "dak",
  "tenn",
  "tex",
  "ut",
  "vt",
  "va",
  "wis",
  "wisc",
  "wy",
  "wyo",
  "usafa",
  "alta",
  "ont",
  "que",
  "sask"
];
var units = [
  "dl",
  "ml",
  "gal",
  "qt",
  "pt",
  "tbl",
  "tsp",
  "tbsp",
  "km",
  "dm",
  "cm",
  "mm",
  "mi",
  "td",
  "hr",
  "hrs",
  "kg",
  "hg",
  "dg",
  "cg",
  "mg",
  "\xB5g",
  "lb",
  "oz",
  "sq ft",
  "hz",
  "mps",
  "mph",
  "kmph",
  "kb",
  "mb",
  "tb",
  "lx",
  "lm",
  "fl oz",
  "yb"
];
let list$2 = [
  [misc$8],
  [units, "Unit"],
  [nouns$3, "Noun"],
  [honorifics$1, "Honorific"],
  [months, "Month"],
  [organizations, "Organization"],
  [places$3, "Place"]
];
let abbreviations = {};
let lexicon$1 = {};
list$2.forEach((a2) => {
  a2[0].forEach((w) => {
    abbreviations[w] = true;
    lexicon$1[w] = "Abbreviation";
    if (a2[1] !== void 0) {
      lexicon$1[w] = [lexicon$1[w], a2[1]];
    }
  });
});
var prefixes$1 = [
  "anti",
  "bi",
  "co",
  "contra",
  "de",
  "extra",
  "infra",
  "inter",
  "intra",
  "macro",
  "micro",
  "mis",
  "mono",
  "multi",
  "peri",
  "pre",
  "pro",
  "proto",
  "pseudo",
  "re",
  "sub",
  "supra",
  "trans",
  "tri",
  "un",
  "out",
  "ex"
].reduce((h2, str) => {
  h2[str] = true;
  return h2;
}, {});
var suffixes$4 = {
  "like": true,
  "ish": true,
  "less": true,
  "able": true,
  "elect": true,
  "type": true,
  "designate": true
};
let compact = {
  "!": "\xA1",
  "?": "\xBF\u0241",
  '"': '\u201C\u201D"\u275D\u275E',
  "'": "\u2018\u201B\u275B\u275C\u2019",
  "-": "\u2014\u2013",
  a: "\xAA\xC0\xC1\xC2\xC3\xC4\xC5\xE0\xE1\xE2\xE3\xE4\xE5\u0100\u0101\u0102\u0103\u0104\u0105\u01CD\u01CE\u01DE\u01DF\u01E0\u01E1\u01FA\u01FB\u0200\u0201\u0202\u0203\u0226\u0227\u023A\u0386\u0391\u0394\u039B\u03AC\u03B1\u03BB\u0410\u0430\u0466\u0467\u04D0\u04D1\u04D2\u04D3\u019B\xE6",
  b: "\xDF\xFE\u0180\u0181\u0182\u0183\u0184\u0185\u0243\u0392\u03B2\u03D0\u03E6\u0411\u0412\u042A\u042C\u0432\u044A\u044C\u0462\u0463\u048C\u048D",
  c: "\xA2\xA9\xC7\xE7\u0106\u0107\u0108\u0109\u010A\u010B\u010C\u010D\u0186\u0187\u0188\u023B\u023C\u037B\u037C\u03F2\u03F9\u03FD\u03FE\u0421\u0441\u0454\u0480\u0481\u04AA\u04AB",
  d: "\xD0\u010E\u010F\u0110\u0111\u0189\u018A\u0221\u018B\u018C",
  e: "\xC8\xC9\xCA\xCB\xE8\xE9\xEA\xEB\u0112\u0113\u0114\u0115\u0116\u0117\u0118\u0119\u011A\u011B\u0190\u0204\u0205\u0206\u0207\u0228\u0229\u0246\u0247\u0388\u0395\u039E\u03A3\u03AD\u03B5\u03BE\u03F5\u0400\u0401\u0415\u0435\u0450\u0451\u04BC\u04BD\u04BE\u04BF\u04D6\u04D7",
  f: "\u0191\u0192\u03DC\u03DD\u04FA\u04FB\u0492\u0493\u017F",
  g: "\u011C\u011D\u011E\u011F\u0120\u0121\u0122\u0123\u0193\u01E4\u01E5\u01E6\u01E7\u01F4\u01F5",
  h: "\u0124\u0125\u0126\u0127\u0195\u01F6\u021E\u021F\u0389\u0397\u0402\u040A\u040B\u041D\u043D\u0452\u045B\u04A2\u04A3\u04A4\u04A5\u04BA\u04BB\u04C9\u04CA",
  I: "\xCC\xCD\xCE\xCF",
  i: "\xEC\xED\xEE\xEF\u0128\u0129\u012A\u012B\u012C\u012D\u012E\u012F\u0130\u0131\u0196\u0197\u0208\u0209\u020A\u020B\u038A\u0390\u03AA\u03AF\u03B9\u03CA\u0406\u0407\u0456\u0457",
  j: "\u0134\u0135\u01F0\u0237\u0248\u0249\u03F3\u0408\u0458",
  k: "\u0136\u0137\u0138\u0198\u0199\u01E8\u01E9\u039A\u03BA\u040C\u0416\u041A\u0436\u043A\u045C\u049A\u049B\u049C\u049D\u049E\u049F\u04A0\u04A1",
  l: "\u0139\u013A\u013B\u013C\u013D\u013E\u013F\u0140\u0141\u0142\u019A\u01AA\u01C0\u01CF\u01D0\u0234\u023D\u0399\u04C0\u04CF",
  m: "\u039C\u03FA\u03FB\u041C\u043C\u04CD\u04CE",
  n: "\xD1\xF1\u0143\u0144\u0145\u0146\u0147\u0148\u0149\u014A\u014B\u019D\u019E\u01F8\u01F9\u0220\u0235\u039D\u03A0\u03AE\u03B7\u03DE\u040D\u0418\u0419\u041B\u041F\u0438\u0439\u043B\u043F\u045D\u048A\u048B\u04C5\u04C6\u04E2\u04E3\u04E4\u04E5\u03C0",
  o: "\xD2\xD3\xD4\xD5\xD6\xD8\xF0\xF2\xF3\xF4\xF5\xF6\xF8\u014C\u014D\u014E\u014F\u0150\u0151\u019F\u01A0\u01A1\u01D1\u01D2\u01EA\u01EB\u01EC\u01ED\u01FE\u01FF\u020C\u020D\u020E\u020F\u022A\u022B\u022C\u022D\u022E\u022F\u0230\u0231\u038C\u0398\u039F\u03B8\u03BF\u03C3\u03CC\u03D5\u03D8\u03D9\u03EC\u03F4\u041E\u0424\u043E\u0472\u0473\u04E6\u04E7\u04E8\u04E9\u04EA\u04EB",
  p: "\u01A4\u03A1\u03C1\u03F7\u03F8\u03FC\u0420\u0440\u048E\u048F\xDE",
  q: "\u024A\u024B",
  r: "\u0154\u0155\u0156\u0157\u0158\u0159\u01A6\u0210\u0211\u0212\u0213\u024C\u024D\u0403\u0413\u042F\u0433\u044F\u0453\u0490\u0491",
  s: "\u015A\u015B\u015C\u015D\u015E\u015F\u0160\u0161\u01A7\u01A8\u0218\u0219\u023F\u0405\u0455",
  t: "\u0162\u0163\u0164\u0165\u0166\u0167\u01AB\u01AC\u01AD\u01AE\u021A\u021B\u0236\u023E\u0393\u03A4\u03C4\u03EE\u0422\u0442",
  u: "\xD9\xDA\xDB\xDC\xF9\xFA\xFB\xFC\u0168\u0169\u016A\u016B\u016C\u016D\u016E\u016F\u0170\u0171\u0172\u0173\u01AF\u01B0\u01B1\u01B2\u01D3\u01D4\u01D5\u01D6\u01D7\u01D8\u01D9\u01DA\u01DB\u01DC\u0214\u0215\u0216\u0217\u0244\u03B0\u03C5\u03CB\u03CD",
  v: "\u03BD\u0474\u0475\u0476\u0477",
  w: "\u0174\u0175\u019C\u03C9\u03CE\u03D6\u03E2\u03E3\u0428\u0429\u0448\u0449\u0461\u047F",
  x: "\xD7\u03A7\u03C7\u03D7\u03F0\u0425\u0445\u04B2\u04B3\u04FC\u04FD\u04FE\u04FF",
  y: "\xDD\xFD\xFF\u0176\u0177\u0178\u01B3\u01B4\u0232\u0233\u024E\u024F\u038E\u03A5\u03AB\u03B3\u03C8\u03D2\u03D3\u03D4\u040E\u0423\u0443\u0447\u045E\u0470\u0471\u04AE\u04AF\u04B0\u04B1\u04EE\u04EF\u04F0\u04F1\u04F2\u04F3",
  z: "\u0179\u017A\u017B\u017C\u017D\u017E\u01B5\u01B6\u0224\u0225\u0240\u0396"
};
let unicode = {};
Object.keys(compact).forEach(function(k2) {
  compact[k2].split("").forEach(function(s2) {
    unicode[s2] = k2;
  });
});
var unicode$1 = unicode;
const prePunctuation = {
  "#": true,
  "@": true,
  "_": true,
  "\xB0": true,
  "\u200B": true,
  "\u200C": true,
  "\u200D": true,
  "\uFEFF": true
};
const postPunctuation = {
  "%": true,
  "_": true,
  "\xB0": true,
  "\u200B": true,
  "\u200C": true,
  "\u200D": true,
  "\uFEFF": true
};
const emoticons$1 = {
  "<3": true,
  "</3": true,
  "<\\3": true,
  ":^P": true,
  ":^p": true,
  ":^O": true,
  ":^3": true
};
var model$4 = {
  one: {
    aliases: aliases$2,
    abbreviations,
    prefixes: prefixes$1,
    suffixes: suffixes$4,
    prePunctuation,
    postPunctuation,
    lexicon: lexicon$1,
    unicode: unicode$1,
    emoticons: emoticons$1
  }
};
const hasSlash = /\//;
const hasDomain = /[a-z]\.[a-z]/i;
const isMath = /[0-9]/;
const addAliases = function(term, world2) {
  let str = term.normal || term.text || term.machine;
  const aliases2 = world2.model.one.aliases;
  if (aliases2.hasOwnProperty(str)) {
    term.alias = term.alias || [];
    term.alias.push(aliases2[str]);
  }
  if (hasSlash.test(str) && !hasDomain.test(str) && !isMath.test(str)) {
    let arr = str.split(hasSlash);
    if (arr.length <= 2) {
      arr.forEach((word) => {
        word = word.trim();
        if (word !== "") {
          term.alias = term.alias || [];
          term.alias.push(word);
        }
      });
    }
  }
  return term;
};
var alias = addAliases;
const hasDash = /^\p{Letter}+-\p{Letter}+$/u;
const doMachine = function(term) {
  let str = term.implicit || term.normal || term.text;
  str = str.replace(/['’]s$/, "");
  str = str.replace(/s['’]$/, "s");
  str = str.replace(/([aeiou][ktrp])in'$/, "$1ing");
  if (hasDash.test(str)) {
    str = str.replace(/-/g, "");
  }
  str = str.replace(/^[#@]/, "");
  if (str !== term.normal) {
    term.machine = str;
  }
};
var machine = doMachine;
const freq = function(view) {
  let docs = view.docs;
  let counts = {};
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      let term = docs[i2][t2];
      let word = term.machine || term.normal;
      counts[word] = counts[word] || 0;
      counts[word] += 1;
    }
  }
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      let term = docs[i2][t2];
      let word = term.machine || term.normal;
      term.freq = counts[word];
    }
  }
};
var freq$1 = freq;
const offset = function(view) {
  let elapsed = 0;
  let index2 = 0;
  let docs = view.document;
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      let term = docs[i2][t2];
      term.offset = {
        index: index2,
        start: elapsed + term.pre.length,
        length: term.text.length
      };
      elapsed += term.pre.length + term.text.length + term.post.length;
      index2 += 1;
    }
  }
};
var offset$1 = offset;
const index = function(view) {
  let document2 = view.document;
  for (let n2 = 0; n2 < document2.length; n2 += 1) {
    for (let i2 = 0; i2 < document2[n2].length; i2 += 1) {
      document2[n2][i2].index = [n2, i2];
    }
  }
};
var index$1 = index;
const wordCount = function(view) {
  let n2 = 0;
  let docs = view.docs;
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      if (docs[i2][t2].normal === "") {
        continue;
      }
      n2 += 1;
      docs[i2][t2].wordCount = n2;
    }
  }
};
var wordCount$1 = wordCount;
const termLoop$1 = function(view, fn) {
  let docs = view.docs;
  for (let i2 = 0; i2 < docs.length; i2 += 1) {
    for (let t2 = 0; t2 < docs[i2].length; t2 += 1) {
      fn(docs[i2][t2], view.world);
    }
  }
};
const methods$2 = {
  alias: (view) => termLoop$1(view, alias),
  machine: (view) => termLoop$1(view, machine),
  normal: (view) => termLoop$1(view, normal),
  freq: freq$1,
  offset: offset$1,
  index: index$1,
  wordCount: wordCount$1
};
var compute$6 = methods$2;
var tokenize = {
  compute: compute$6,
  methods: methods$3,
  model: model$4,
  hooks: ["alias", "machine", "index", "id"]
};
const typeahead$1 = function(view) {
  const prefixes2 = view.model.one.typeahead;
  const docs = view.docs;
  if (docs.length === 0 || Object.keys(prefixes2).length === 0) {
    return;
  }
  let lastPhrase = docs[docs.length - 1] || [];
  let lastTerm = lastPhrase[lastPhrase.length - 1];
  if (lastTerm.post) {
    return;
  }
  if (prefixes2.hasOwnProperty(lastTerm.normal)) {
    let found = prefixes2[lastTerm.normal];
    lastTerm.implicit = found;
    lastTerm.machine = found;
    lastTerm.typeahead = true;
    if (view.compute.preTagger) {
      view.last().unTag("*").compute(["lexicon", "preTagger"]);
    }
  }
};
var compute$5 = { typeahead: typeahead$1 };
const autoFill = function() {
  const docs = this.docs;
  if (docs.length === 0) {
    return this;
  }
  let lastPhrase = docs[docs.length - 1] || [];
  let term = lastPhrase[lastPhrase.length - 1];
  if (term.typeahead === true && term.machine) {
    term.text = term.machine;
    term.normal = term.machine;
  }
  return this;
};
const api$r = function(View2) {
  View2.prototype.autoFill = autoFill;
};
var api$s = api$r;
const getPrefixes = function(arr, opts2, world2) {
  let index2 = {};
  let collisions = [];
  let existing = world2.prefixes || {};
  arr.forEach((str) => {
    str = str.toLowerCase().trim();
    let max2 = str.length;
    if (opts2.max && max2 > opts2.max) {
      max2 = opts2.max;
    }
    for (let size = opts2.min; size < max2; size += 1) {
      let prefix2 = str.substring(0, size);
      if (opts2.safe && world2.model.one.lexicon.hasOwnProperty(prefix2)) {
        continue;
      }
      if (existing.hasOwnProperty(prefix2) === true) {
        collisions.push(prefix2);
        continue;
      }
      if (index2.hasOwnProperty(prefix2) === true) {
        collisions.push(prefix2);
        continue;
      }
      index2[prefix2] = str;
    }
  });
  index2 = Object.assign({}, existing, index2);
  collisions.forEach((str) => {
    delete index2[str];
  });
  return index2;
};
var allPrefixes = getPrefixes;
const isObject = (val) => {
  return Object.prototype.toString.call(val) === "[object Object]";
};
const defaults$1 = {
  safe: true,
  min: 3
};
const prepare = function(words2 = [], opts2 = {}) {
  let model2 = this.model();
  opts2 = Object.assign({}, defaults$1, opts2);
  if (isObject(words2)) {
    Object.assign(model2.one.lexicon, words2);
    words2 = Object.keys(words2);
  }
  let prefixes2 = allPrefixes(words2, opts2, this.world());
  Object.keys(prefixes2).forEach((str) => {
    if (model2.one.typeahead.hasOwnProperty(str)) {
      delete model2.one.typeahead[str];
      return;
    }
    model2.one.typeahead[str] = prefixes2[str];
  });
  return this;
};
var lib = {
  typeahead: prepare
};
const model$3 = {
  one: {
    typeahead: {}
  }
};
var typeahead = {
  model: model$3,
  api: api$s,
  lib,
  compute: compute$5,
  hooks: ["typeahead"]
};
nlp$1.extend(change);
nlp$1.extend(output);
nlp$1.extend(match);
nlp$1.extend(pointers);
nlp$1.extend(tag);
nlp$1.plugin(contractions);
nlp$1.extend(tokenize);
nlp$1.plugin(cache$1);
nlp$1.extend(lookup);
nlp$1.extend(typeahead);
nlp$1.extend(lexicon$2);
nlp$1.extend(sweep);
var irregularPlurals = {
  addendum: "addenda",
  corpus: "corpora",
  criterion: "criteria",
  curriculum: "curricula",
  genus: "genera",
  memorandum: "memoranda",
  opus: "opera",
  ovum: "ova",
  phenomenon: "phenomena",
  referendum: "referenda",
  alga: "algae",
  alumna: "alumnae",
  antenna: "antennae",
  formula: "formulae",
  larva: "larvae",
  nebula: "nebulae",
  vertebra: "vertebrae",
  analysis: "analyses",
  axis: "axes",
  diagnosis: "diagnoses",
  parenthesis: "parentheses",
  prognosis: "prognoses",
  synopsis: "synopses",
  thesis: "theses",
  neurosis: "neuroses",
  appendix: "appendices",
  index: "indices",
  matrix: "matrices",
  ox: "oxen",
  sex: "sexes",
  alumnus: "alumni",
  bacillus: "bacilli",
  cactus: "cacti",
  fungus: "fungi",
  hippopotamus: "hippopotami",
  libretto: "libretti",
  modulus: "moduli",
  nucleus: "nuclei",
  octopus: "octopi",
  radius: "radii",
  stimulus: "stimuli",
  syllabus: "syllabi",
  cookie: "cookies",
  calorie: "calories",
  auntie: "aunties",
  movie: "movies",
  pie: "pies",
  rookie: "rookies",
  tie: "ties",
  zombie: "zombies",
  leaf: "leaves",
  loaf: "loaves",
  thief: "thieves",
  foot: "feet",
  goose: "geese",
  tooth: "teeth",
  beau: "beaux",
  chateau: "chateaux",
  tableau: "tableaux",
  bus: "buses",
  gas: "gases",
  circus: "circuses",
  crisis: "crises",
  virus: "viruses",
  database: "databases",
  excuse: "excuses",
  abuse: "abuses",
  avocado: "avocados",
  barracks: "barracks",
  child: "children",
  clothes: "clothes",
  echo: "echoes",
  embargo: "embargoes",
  epoch: "epochs",
  deer: "deer",
  halo: "halos",
  man: "men",
  woman: "women",
  mosquito: "mosquitoes",
  mouse: "mice",
  person: "people",
  quiz: "quizzes",
  rodeo: "rodeos",
  shoe: "shoes",
  sombrero: "sombreros",
  stomach: "stomachs",
  tornado: "tornados",
  tuxedo: "tuxedos",
  volcano: "volcanoes"
};
var lexData = {
  "Comparative": "true\xA6bett1f0;arth0ew0in0;er",
  "Superlative": "true\xA6earlier",
  "PresentTense": "true\xA6bests,sounds",
  "Condition": "true\xA6lest,unless",
  "PastTense": "true\xA6began,came,d4had,kneel3l2m0sa4we1;ea0sg2;nt;eap0i0;ed;id",
  "Participle": "true\xA60:0A;a07b02c00dXeat0fSgQhPoJprov0rHs7t6u4w1;ak0ithdra03o2r1;i03uZ;k0v0;nd1pr05;ergoJoJ;ak0hHo3;e9h7lain,o6p5t4un3w1;o1um;rn;g,k;ol0reT;iRok0;ught,wn;ak0o1ruL;ne,wn;en,wn;ewriOi1uK;dd0s0;ut3ver1;do4se0t1;ak0h2;do2g1;roH;ne;ast0i7;iv0o1;ne,tt0;all0loCor1;bi3g2s1;ak0e0;iv0oA;dd0;ove,r1;a6eamt,iv0u1;nk;hos0lu1;ng;e4i3lo2ui1;lt;wn;tt0;at0en,gun;r2w1;ak0ok0;is0;en",
  "Gerund": "true\xA6accord0be0doin,go0result0stain0;ing",
  "Expression": "true\xA6a0Xb0Tc0Rd0Ne0Lg0FhZjeez,lWmVnToNpKsItHuEvDw6y0;a4e3i1u0;ck,p;k04p0;ee,pee;ah,p,s;!a,y;a5h2o1t0;af,f;rd up,w;atsoever,e1o0;a,ops;e,w;hoo,t;ery wEoi0L;gh,h0;! 0h,m;huh,oh;here nQsk,ut tut;h0ic;eesh,hh,it,oo;ff,h1l0ow,sst;ease,s,z;ew,ooey;h1i,mg,o0uch,w,y;h,o,ps;! 0h;h1my go0w1;d,sh;ell;ah,evertheless,o0;!pe;eh,mm;ah,eh,m1ol0;!s;ao,fao;aCeBi9o2u0;h,mph,rra0zzC;h,y;l1o0;r6y9;la,y0;! 0;c1moCsmok0;es;ow;!p hip hoor0;ay;ck,e,llo,y;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;e0h,t cetera,ww,xcuse me;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;mon,o0;ngratulations,wabunga;a2oo1r0tw,ye;avo,r;!ya;h,m; 1h0ka,las,men,rgh,ye;!a,em,h,oy;la",
  "Negative": "true\xA6n0;ever,o0;n,t",
  "QuestionWord": "true\xA6how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",
  "Reflexive": "true\xA6h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self",
  "Plural": "true\xA6dick0gre0ones,records;ens",
  "Unit|Noun": "true\xA6cEfDgChBinchAk9lb,m6newt5oz,p4qt,t1y0;ardEd;able1b0ea1sp;!l,sp;spo1;a,t,x;on9;!b,g,i1l,m,p0;h,s;!les;!b,elvin,g,m;!es;g,z;al,b;eet,oot,t;m,up0;!s",
  "Value": "true\xA6a few",
  "Imperative": "true\xA6bewa0come he0;re",
  "Plural|Verb": "true\xA6leaves",
  "Demonym": "true\xA60:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an",
  "Organization": "true\xA60:4D;a3Gb2Yc2Ed26e22f1Xg1Ph1Ki1Hj1Fk1Dl18m0Wn0Jo0Gp09qu08r01sTtGuBv8w3xiaomi,y1;amaha,m13ou1w13;gov,tu2Z;a3e1orld trade organizati2S;lls fargo,st1;fie28inghou2I;l1rner br3I;gree37l street journ29m17;an halOeriz2Nisa,o1;dafo2Ol1;kswagMvo;b4kip,n2ps,s1;a tod2Yps;es3Ai1;lev33ted natio30;er,s; mobi2Qaco beQd bNeAgi frida9h3im horto2Ymz,o1witt31;shi3Xy1;ota,s r 00;e 1in lizzy;b3carpen37daily ma31guess w2holli0rolling st1Rs1w2;mashing pumpki2Tuprem0;ho;ea1lack eyed pe3Lyrds;ch bo1tl0;ys;l2n3Ds1xas instrumen1J;co,la m15;efoni0Cus;a7e4ieme2Lnp,o2pice gir5quare04ta1ubaru;rbucks,to2R;ny,undgard1;en;a2x pisto1;ls;g1Nrs;few2Ainsbury2QlesforYmsu22;.e.m.,adiohead,b6e3oyal 1yana30;b1dutch she4;ank;aders dige1Gd 1max,vl1R;bu1c1Zhot chili peppe2Nlobst2C;ll;c,s;ant30izno2I;a5bs,e3fiz28hilip morrCi2r1;emier2Audenti16;nk floyd,zza hut;psi2Btro1uge0A;br2Vchina,n2V;lant2Nn1yp12; 2ason20da2I;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0L;l,s;c,st1Htflix,w1; 1sweek;kids on the block,york09;a,c;nd1Vs2t1;ional aca2Io,we0Q;a,cYd0O;aBcdonaldAe7i5lb,o3tv,y1;spa1;ce;b1Mnsanto,ody blu0t1;ley crue,or0O;crosoft,t1;as,subisM;dica2rcedes benz,talli1;ca;id,re;'s,s;c's milk,tt14z1Z;'ore08a3e1g,ittle caesa1K;novo,x1;is,mark; 1bour party;pres0Bz boy;atv,fc,kk,m1od1J;art;iffy lu0Moy divisi0Gpmorgan1sa;! cha07;bm,hop,n1tv;g,te1;l,rpol;asbro,ewlett pack1Ri3o1sbc,yundai;me dep1n1L;ot;tac1zbollah;hi;eneral 6hq,ithub,l5mb,o2reen d0Lu1;cci,ns n ros0;ldman sachs,o1;dye1g0E;ar;axo smith kli03encoV;electr0Km1;oto0W;a4bi,da,edex,i2leetwood mac,o1rito l0D;rd,xcX;at,nancial1restoY; tim0;cebook,nnie mae;b08sa,u3xxon1; m1m1;ob0H;!rosceptics;aiml0Be6isney,o4u1;nkin donu2po0Xran dur1;an;ts;j,w j1;on0;a,f lepp0Zll,peche mode,r spiegZstiny's chi1;ld;aIbc,hEiCloudflaBnn,o3r1;aigsli5eedence clearwater reviv1ossra06;al;ca c7inba6l4m1o0Bst06;ca2p1;aq;st;dplPg1;ate;se;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r1y;on;dbury,pital o1rl's jr;ne;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser-busDol,pple9r6s3utodesk,v2y1;er;is,on;hland1sociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;!-lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba",
  "Possessive": "true\xA6its,my,our0thy;!s",
  "Noun|Verb": "true\xA60:9U;1:A8;2:94;3:A1;4:9P;5:A0;6:9I;7:8L;8:7J;9:A6;A:91;B:8V;C:8B;a9Mb8Oc7Gd6Pe6Ef5Qg5Gh54i4Wj4Tk4Ql4Em40n3Vo3Sp2Squ2Rr21s0Jt02u00vVwGyFzD;ip,oD;ne,om;awn,e6Die66;aOeMhJiHoErD;ap,e9Mink2;nd0rDuB;kDry,sh5Fth;!shop;ck,nDpe,re,sh;!d,g;e84iD;p,sD;k,p0t2;aDed,lco8U;r,th0;it,lk,rEsDt4ve,x;h,te;!ehou1ra9;aGen5DiFoD;iDmAte,w;ce,d;be,ew,sA;cuum,l4A;pDr7;da5gra6Clo68;aReQhrPiOoMrGuEwiDy5X;n,st;nDrn;e,n7M;aGeFiEoDu6y;t,ub2;bu5ck4Igg0m,p;at,k,nd;ck,de,in,nsDp,v7H;f0i8P;ll,ne,p,r4Wss,t92uD;ch,r;ck,de,e,le,me,p,re;e5Uow,u6;ar,e,ll,mp0st,xt;g,lDng2rg7Ns5x;k,ly;a0Sc0Ne0Kh0Fi0Dk0Bl09m08n06o05pXquaCtKuFwD;ea86iD;ng,pe,t4;bGit,m,ppErD;fa3ge,pri1v2U;lDo6Q;e6Ny;!je8;aMeLiKoHrEuDy2;dy,ff,mb2;a83eEiDo5Nugg2;ke,ng;am,ss,t4;ckEop,p,rD;e,m;ing,pi2;ck,nk,t4;er,m,p;ck,ff,ge,in,ke,lEmp,nd,p2rDte,y;!e,t;k,l;aJeIiHlGoFrDur,y;ay,e54inDu3;g,k2;ns89t;a5Oit;ll,n,r85te;ed,ll;m,n,rk;b,uB;aDee1Tow;ke,p;a5He4Di2o51;eep,iDou4;ce,p,t;ateboa7HiD;!p;de,gnDl2Unk,p,ze;!al;aGeFiEoDuff2;ck,p,re,w;ft,p,v0;d,i3Wlt0;ck,de,pe,re,ve;aEed,nDrv1It;se,t2M;l,r4t;aGhedu2oCrD;aEeDibb2o3X;en,w;pe,t4;le,n,r2L;cDfegua70il,mp2;k,rifi3;aZeHhy6JiGoEuD;b,in,le,n,s5V;a6ck,ll,oDpe,u5;f,t;de,ng,ot,p,s1V;aTcSdo,el,fQgPje8lOmMnLo17pJque6sFturn,vDwa6T;eDi26;al,r1;er72oFpe8tEuD;lt,me;!a53;l6Zrt;air,eaDly,o51;l,t;dezvo2Xt;aDedy;ke,rk;ea1i4E;a6Gist0r5L;act6Wer1Uo6ZuD;nd,se;a36o6D;ch,s6E;c1Cge,iEke,lly,nDp1Vt1V;ge,k,t;n,se;es69iv0;a04e00hYiXlToNrEsy4uD;mp,n4rcha1sh;aKeIiHoDu4M;be,ceFdu3fi2grDje8mi1p,te6;amDe6U;!me;ed,ss;ce,de,nt;sDy;er6As;cti3i1;iHlFoEp,re,sDuBw0;e,i5Wt;l,p;iDl;ce,sh;nt,s5T;aEce,e30uD;g,mp,n7;ce,nDy;!t;ck,le,n16pe,tNvot;a1oD;ne,tograph;ak,eFnErDt;fu53mA;!c30;!l,r;ckJiInHrFsEtDu1y;ch,e9;s,te;k,tD;!y;!ic;nt,r,se;!a7;bje8ff0il,oErDutli3Over49;bAd0ie9;ze;a4PeFoDur1;d,tD;e,i3;ed,gle8tD;!work;aMeKiIoEuD;rd0;ck,d3Pld,nEp,uDve;nt,th;it5CkD;ey;lk,n49rr5AsDx;s,ta29;asuCn4SrDss;ge,it;il,nFp,rk3UsEtD;ch,t0;h,k,t0;da5n0oeuvC;aLeJiHoEuD;mp,st;aEbby,ck,g,oDve;k,t;d,n;cDft,mAnHst;en1k;aDc0Ne4vJ;ch,d,k,p,se;bEcDnd,p,t4un4;e,k;el,o2T;eEiDno4D;ck,d,ll,ss;el,y;aEo1NuD;i3mp;m,zz;mpJnEr45ssD;ue;c1Qdex,fluGha2k,se2GteDvoi3;nt,rD;e6fa3viD;ew;en3;a8le29;aJeHiGoEuD;g,nt;l39no2Cok,pDr1u1;!e;ghli1Eke,nt,re,t;aDd7lp;d,t;ck,mGndFrEsh,tDu9;ch,e;bo3Wm,ne4Dve6;!le;!m0;aLear,ift,lJossIrFuD;arDe49lp,n;antee,d;aEiDouBumb2;ll,nd,p;de,sp;ip;oDue;ss,w;g,in,me,ng,s,te,ze;aZeWiRlNoJrFuD;ck,el,nDss,zz;c38d;aEoDy;st,wn;cDgme,me,nchi1;tuC;cFg,il,ld,rD;ce,e29mDwa31;!at;us;aFe0Vip,oDy;at,ck,od,wD;!er;g,ke,me,re,sh,vo1E;eGgFlEnDre,sh,t,x;an3i0Q;e,m,t0;ht,uC;ld;aEeDn3;d,l;r,tuC;ce,il,ll,rm,vo2W;cho,d7ffe8nMsKxFyeD;!baD;ll;cGerci1hFpDtra8;eriDo0W;en3me9;au6ibA;el,han7u1;caDtima5;pe;count0d,vy;a01eSiMoJrEuDye;b,el,mp,pli2X;aGeFiEoD;ne,p;ft,ll,nk,p,ve;am,ss;ft,g,in;cEd7ubt,wnloD;ad;k,u0E;ge6p,sFt4vD;e,iDor3;de;char7gui1h,liEpD;at4lay,u5;ke;al,bKcJfeIlGmaBposAsEtaD;il;e07iD;gn,re;ay,ega5iD;ght;at,ct;li04rea1;a5ut;b,ma7n3rDte;e,t;a0Eent0Dh06irc2l03oKrFuD;be,e,rDt;b,e,l,ve;aGeFoEuDy;sh;p,ss,wd;dAep;ck,ft,sh;at,de,in,lTmMnFordina5py,re,st,uDv0;gh,nDp2rt;s01t;ceHdu8fli8glomeIsFtDveN;a8rD;a6ol;e9tru8;ct;ntDrn;ra5;bHfoGmFpD;leDouBromi1;me9;aBe9it,u5;rt;at,iD;ne;lap1oD;r,ur;aEiDoud,ub;ck,p;im,w;aEeDip;at,ck,er;iGllen7nErD;ge,m,t;ge,nD;el;n,r;er,re;ke,ll,mp,noe,pGrXsFtEuDve;se,ti0I;alog,ch;h,t;!tuC;re;a03eZiXlToPrHuEyD;pa11;bb2ck2dgEff0mp,rDst,zz;den,n;et;anJeHiFoadEuD;i1sh;ca6;be,d7;ge;aDed;ch,k;ch,d;aFg,mb,nEoDrd0tt2x,ycott;k,st,t;d,e;rd,st;aFeBiDoYur;nk,tz;nd;me;as,d,ke,nd,opsy,tD;!ch,e;aFef,lt,nDt;d,efA;it;r,t;ck,il,lan3nIrFsEtt2;le;e,h;!gDk;aDe;in;!d,g,k;bu1c05dZge,iYlVnTppQrLsIttGucEwaD;rd;tiD;on;aDempt;ck;k,sD;i6ocia5;st;chFmD;!oD;ur;!iD;ve;eEroa4;ch;al;chDg0sw0;or;aEt0;er;rm;d,m,r;dreHvD;an3oD;ca5;te;ce;ss;cDe,he,t;eFoD;rd,u9;nt;nt,ss;se",
  "Actor": "true\xA60:7C;1:7H;2:6B;3:7G;4:7P;5:7L;6:72;a6Pb64c4Xd4De43f3Tg3Ch31i2Vj2Rkin2Ql2Lm27n20o1Tp0Wqu0Ur0KsRtKuIvFw9yo7;gi,ut7;h,ub0;aBeAi9o8r7;estl0it0;m2rk0;fe,nn0t2Cza2I;atherm2ld0;ge earn0it0nder0rri1;eter8i7oyG;ll5Sp,s41;an,ina2V;n7s0;c6Wder04;aoisea24eAherapi5iktok0o9r7ut1yco6;a7endseMo45;d0mp,nscri0Cvel0;ddl0u1H;a0Rchn8en7na4st0;ag0;i3Qo0E;aiYcVeShQiNki0mu27oKpHquaGtCu8wee7;p0theart;lt2per8r7;f0ge6viv1;h7inten0Jst5Kvis1;ero,um2;a9ep8r7;ang0eam0;bro2Oc2Pfa2Omo2Osi21;ff0tesm2;tt0;ec8ir2Eo7;kesp5Bu0N;ia5Lt3;l8me6Cn,rcere7ul;r,ss;di0oi5;n8s7;sy,t0;g0n0;am2ephe1Jow7;girl,m2r2R;cretJnior cit3Hr7;gea4v7;a4it1;hol4Zi8reen7ulpt1;wr2D;e02on;l1nt;aFeAo9u7;l0nn7;er up,ingF;g42le mod41of0;a51c9fug2Rpo34searRv7;ere4Wolution7;ary;e7luZru23;ptio3V;bbi,dic5Xpp0;arter7e31;back;aZeXhTiSlPoLr9sycho8u7;nk,p34;logi5;aHeEiCo7;dAfess1g8ph49s7;pe2Mtitu53;en7ramm0;it1y;igy,uc0;est4Pme mini0Vnce7s3G;!ss;a8si7;de4;ch0;ctiti3Bnk0Q;dca0Pet,li7pula52rnst44;c2Ktic7;al scie7i2;nti5;a7umb0;nn0y7;er,ma4Nwright;lgrim,one0;a9iloso8otogra8ra7ysi1X;se;ph0;ntom,rmaci5;r7ssi1V;form0s6;i3Gl,nel40r9st1tr7wn;i7on;arXot;ent4Yi44tn0;ccupa4ffCp9r8ut7;ca5l0C;ac4Kganiz0ig2Hph2;er3t7;i1Lomet7;ri5;ic0spring;aCeAie4Zo8u7;n,rser3L;b7mad,vi4X;le2Xo4F;i7mesis,phew;ce,ghb1;nny,rr3t20;aFeEiBo8u7yst21;m9si18;der3gul,m8n7th0;arEk;!my;ni8s7;f03s0Kt0;on,st0;chan1Tnt1rcha4;giAk0n9rtyr,t7y1;e,riar7;ch;ag0iac;ci2stra3K;a8e2Cieutena4o7;rd,s0v0;bor0d8ndlo7ss,urea3Hwy0ym2;rd;!y;!s2A;anitor ,e9o8u7;ggl0;gg0urna2W;st0;c6dol,llu3Wmmigra4n7;-lAc1Sfa4habi44nov3s8ve7;nt1stig3;pe0Pt7;a1Hig3ru0O;aw;airGeCistoBo9u7ygie1M;man7nt0sba2J;!ita9;bo,st7usekO;age,e3R;ri2;ir,r7;m8o7;!ine;it;dress0sty2E;aMeJhostHirl28ladi3oDrand8u7;e5ru;cAdaugTfa9m8pa7s6;!re4;a,o7;th0;hi1D;al8d7lf0;!de3C;ie,k7te28;eep0;!wr7;it0;isha,n7;i7tl06;us;mbl0rden0;aFella,iBo8r7;eela2Pie1R;e,re7ster pare4;be1Jm2r7st0;unn0;an31g9lmm19nanci0r7tt0;e7st la2J; marsh2Qfig7m2;ht0;rm0th0;conoFdElectriDm9n8x7;amin0cellency,i2B;emy,trepreneur,vironmenta1K;c9p7;er1loye7;e,r;ee;ci2;it1;mi5;aLeCi9ork,ri8u7we03;de,tche2I;ft0vK;ct3eti8plom2Ire7va;ct1;ci2ti2;aEcor3fencDi0JnBputAs8tectNvel7;op0;ce1He7ign0;rt0;ee,y;iz7;en;em2;c6l0;dAnc0redev9ught7;er7;! ;il;!dy;a06e04fo,hXitizenWlToCrAu7;r3stomer7;! representat7;ive;e3it7;ic;-work0lJmGnAord9rpor1Nu7wboy;n7ri0sin ;ciUte1R;in3;fidantBgressTsAt7;e0Lr7;ibut1o7;ll0;tab14ul1P;!e;edi2m7pos0rade;a0FeRissi7;on0;leag9on8um7;ni5;el;ue;e7own;an0r7;ic,k;!s;aAe8i7um;ld;erle7f;ad0;ir8nce7plGract0;ll1;m2wJ;lebri7o;ty;dCptBr7shi0;e8pe7;nt0;r,t7;ak0;ain;et;aNeMiKlogg0oFrCu7;dd0Gild0rglAsiness7;m2p8w7;om2;ers6;ar;i8o7;!k0th0;cklay0de,gadi0;hemi2oge9y7;!frie7;nd;ym2;an;cyc7sS;li5;atbox0ings;by,nk0r7;b0on8te7;nd0;!e08;c05dXge4nRpMrIsGtBu8yatull7;ah;nt8t7;h1oH;!ie;h9t7;e7orney;nda4;ie5le7;te;sis01tron7;aut,om0;chbis9isto8tis7;an,t;crV;hop;ostAp7;ari7rentiT;ti6;on;le;aAcest1im3nou9y7;bo7;dy;nc0;ly5rc7;hi5;mi9v7;entur0is1;er;ni8r7;al;str3;at1;or;counCquaintanBrobAt7;ivi5or,re7;ss;st;at;ce;ta4;nt",
  "Adj|Noun": "true\xA60:1F;1:1M;a1Db17c0Vd0Se0Nf0Eg0Bh09i07ju06l03mXnVoTpOrJsCt8u5v2watershed;a2ision10;gabo5nilla,ria2;b0Wnt;ndergr2pstairs;adua14ou2;nd;a4e2oken,ri0;en,r2;min0rori13;boo,n;age,e6ilv0Glack,o4quat,ta3u2well;bordina0Xper6;b0Mndard;ciali0Yl2vereign;e,ve1;cret,n2ri0;ior;a5e3ou2ubbiM;nd,tiZ;ar,bCl0Ynt0p2side1;resent0Xublican;ci0Qsh;a5eriodic0last11otenti0r2;emi3incip0o2;!fession0;er,um;rall5st,tie1;ff2pposi0Hv0;ens0Qi0D;agg02ov2;el;a6e4iniatKo2;bi02der08r2;al,t0;di2tr0P;an,um;le,riH;attPi3u2;sh;ber0ght,qD;stice,veniU;de0mpressioZn2;cumbe1dividu0no0Fsta1terim;alf,o2umdrum;bby,melG;en3old,ra2;ph0Dve;er0ious;a8e6i5l4u2;git05t2;ure;uid;ne;llow,m2;aGiM;ir,t,vo2;riOuriO;l4p02x2;c2ecutWpeX;ess;d2iK;er;ar3e2;mographWrivQ;k,l3;hiGlassUo3rude,unn2;ing;m6n2operM;creCstitue1te3vertab2;le;mpor2nt;ary;ic,m3p2;anion,lex;er3u2;ni8;ci0;e6lank,o5r2;i3u2;te;ef;ttom,urgeois;st;cademCd9l5n3r2;ab,ctB;im0tarctA;al;e4tern2;at2;ive;rt;oles2ult;ce1;nt;ic",
  "Adj|Past": "true\xA60:4C;1:40;2:45;3:42;4:3B;a3Tb3Ic2Vd2Ae22f1Wg1Th1Qi1Hj1Ekno1Dl18m13n10o0Vp0Lqu0Jr07sKtEuBvAw5yellow0;a8ea7o5rinkl0;r5u3N;n,ri0;k2Qth3;rp0sh0tY;ari0e1M;n5pd1s0;cov3derstood,i5;fi0t0;a8hreat2Ki7ouTr5urn0wi42;a5imm0ou28;ck0in0pp0;ed,r0;m0nn0r5;get0ni2K;aPcLeJhHimGm0Hoak0pEt8u5;bsid3Fgge3Vs5;pe5ta2P;ct0nd0;a9e8i26ok0r6u5;ff0nn0;ength28ip5;ed,p0;am0reotyp0;in0t0;eci5ik0oI;al35fi0;pSul1;a5ock0ut;d0r0;a5c1Dle2t2S;l0s3Jt0;a7or6r5;at5e1W;ch0;r0tt3;t5ut0;is4ur1;aFe6o5;tt0;cBdJf22gAje2l9m0Knew0p8qu7s5;eTpe2t5;or0ri2;e34ir0;e1lac0;at0e2H;ist3ul1;eiv0o5ycl0;mme2Crd0v3;in0lli0ti4;a5ot0;li4;aCer2RiBlAo9r5ump0;e7i2Go5;ce27d5lo14nou2Spos0te2v0;uc0;fe15ocDp0Fss0;i2Cli1D;ann0e24uT;ck0erc0ss0;ck0i29r5st0;allMk0;bse8c7rgan25ver5;lo5whelm0;ok0;cupi0;rv0;e6o5;t0uri12;ed0gle2;a7e6ix0o5ut0;di4t0Xu1Y;as07lt0;n5rk0;ag0ufact05;e7i6o5;ad0ck0st;cens0mit0st0;ft,v5;el0;tt0wn;a6o0Xu5;dg0s13;gg0;llumin1mpBn5sol1;br0cre1Ddebt0f9jUt6v5;it0olv0;e5ox0Q;gr1n5re1V;d0si4;e2l1o1O;li0oVr5;ov0;amm3e1o5;ok0r5;ri4;ift0r6u5;a14id0;i0Kown;a9e8i7lavo0Goc0Cr5;a5i0oz0S;ctEg13m0;ni04tt0x0;ar0;d0il0;duc1l1mBn9quipp0s8x5;agger1p5te0Q;a0Pe5os0;ct0rie1A;cap0tabliX;gFha18s5;ur0;a0Xbarra0L;aMeEi6r5;a00i0;gni4miniRre2s5;aAc7grun0Et5;o5re0Gurb0;rt0;iplVou5;nt0r5;ag0;bl0;cBdQf9l8pre0Ara7t6v5;elop0ot0;ail0ermP;ng0;ay0ight0;e5in0o0M;rr0;ay0enTor1;m5t0z0;ag0p5;en0;aQeMhJlIoAr7u5;lt5r0stom04;iv1;a6owd0u5;sh0;ck0mp0;d0loBm8n5ok0v3;centr1f6s5troD;id3olid1;us0;b6pl5;ic1;in0;r0ur0;assi4os0utt3;ar6i5;ll0;g0m0;lebr1n7r5;ti4;fi0;tralK;g0lcul1;aEiDlAo8r6urn5;ed,t;ok5uis0;en;il0r0t5und;tl0;e6i5;nd0;ss0;as0;k0laNs0tt3;bandQcOdLfJg0lGmaz0nEppCrm0ssAu6wa5;rd0;g6thor5;iz0;me5;nt0;o7u5;m0r0;li0re5;ci1;im1ticip1;at0;a6leg0t3;er0;rm0;fe2;ct0;ju6o8va5;nc0;st0;ce5knowledg0;pt0;on0;ed",
  "Singular": "true\xA60:5J;1:5H;2:4W;3:52;4:4S;5:57;6:5L;7:56;a51b4Jc3Md34e2Wf2Mg2Gh25in21j20k1Zl1Sm1Kn1Go1Ap0Qqu0Pr0EsYtLuGvBw8x r57yo yo;a8ha3Oo3P;f4i4Qt0Fy8;! arou38;arBe9ideo ga2Po8;cabu4Hl5B;gNr8t;di4Yt1V;iety,ni4O;nAp2Zr9s 8;do42s5D;bani1in0;coordinat39der8;estima1to21we40; rex,aJeIhGiEoDrAu9v8;! show;m2Nn2rntKto1B;agedy,ib8o4D;e,u8;n0ta44;ni1p2rq3K;c,er,m8;etE;ing8ree25;!y;am,mp3E;ct2le6x return;aMcLeJhor4PiIkGoFpin off,tCuAy8;ll8ner7st4S;ab2W;b8i1n27per bowl,rro1W;st3Ktot0;at9ipe2Fo1Irate7udent8;! lo0H;i38u1;ft ser4Kmeo1F;elet5i8;ll,r3U;b37gn2Ste;ab2Ic8min3A;t,urity gua2M;e6ho2X;bbatic0la3Hndwi0Opi5;av5eChetor2i9o8;de6om,w;t9v8;erb2B;e,u0;bCcAf8publ2r0Xspi1;er8orm4;e6r0;i8ord label;p2Gt0;a1u45;estion mark,ot2E;aOeLhoKiHlFoDr9u8yram1E;ddi3GpDrpo1Is3I;eAo8;bl3Ys8;pe3Ita1;dic1Qmi1Ep1Proga3Uss relea1E;p8rt0;py;a8ebisci1;q2Cte;cn2e9g8;!gy;!r;ne call,tocoJ;anut,d9r8t0yo1;cen3Isp3J;al,est0;nop3r9t8;e,hog5;adi10i2U;atme0bj3EcApia1rde0thers,utspok5ve8wn4;n,r8;ti0Oview;cu9e8;an;pi4;arAit9ot8umb4;a2Dhi2Q;e,ra1;cot2ra36;aDeBi9o8ur0\xE90C;nopo3p17rni2Msq1Qti35uld;c,li10n08s8tt5;chief,si33;d8nu,t0;al,ic;gna1mm0nd15rsupi0te8yf3;ri0;aCegBiAu8;ddi1n8;ch;ght bulb,me,p09ving room; 9e0M;bor14y 8;up;eyno1itt5;el3ourn0;cAdices,itia2Oni26s9tel0Mvert8;eb1K;e29titu1;en2Li2U;aHeDighCo9u8;man right,s23;me8rmoEsp1Gtb0L;! r8;un; scho0ZriZ;a8i1O;d8v5; start,pho8;ne;ndful,sh brown,v5ze;aBelat0Jlaci4r9u8yp1T;l3y;an8enadi4id;a1Bd slam,ny;df3r8;l2ni1I;aGeti1HiFlu1oCr9un8;er0;ee market,i9on8;ti4;ga1;l3ur8;so8;me;eOref3;br2mi3n10;conoEffi7gg,lecto0Qmbas1DnBpidem2s1Yth2venAx9yel8;id;ampYempl0Mte6;i18t;er7terp8;ri8;se;my;eKiDoAr8ump tru0T;agonf3i8;er,ve thru;c9g7i3or,ssi4wn8;side;to0DumenD;aDgniCnn4s9vide8;nd;conte6incen1Dp8tri10;osi8;tion;ta0F;le0W;athAc9f8ni0terre6;ault 04err0;al,im0;!b8;ed;aVeShLiKlIoCr8;edit caAuc8;ib8;le;rd;efficCke,lBmmuniqKns9pi4rr0t0Wus8yo1;in;erv8uH;ato00;ic,lP;ie6;er7i8oth;e6n2;ty,vil wL;aCeqBick5ocoAr8;istmas car8ysanthemum;ol;la1;ue;ndeli4racteri8;st2;i9llDr8;e0tifica1;liY;hi4nEpDrBt8ucus;erpi8hedr0;ll8;ar;!bohyd8ri4;ra1;it0;a8e,nib0;l,ry;aMeLiop2leJoHrDu8;nBr8tterf3;g8i0;la8;ry;ny;eak9i8;ck;fa8throA;st;dy,ro8wl;ugh;mi8;sh;an,l3;nki9rri4;er;ng;cRdLlHnEppeti1rCsAtt2utop8;sy;ic;ce6pe8;ct;r8sen0;ay;ec9oma3ti9;ly;do1;i5l8;er7y;gy;en; hominCj9van8;tage;ec8;ti8;ve;em;cBe9qui8;tt0;ta1;te;i9ru0;al;de6;nt",
  "Person|Noun": "true\xA6a07b01cYdRePfOgMhJjFkiElDmBolive,p7r4s3trini00v1wa0;ng,rd;an,enus,iol0;a,et;ky,on5umm02;ay,e1o0uby;bin,d,se;ed,x;a2e0ol;aHn0;ny;ge,tM;a0eloR;x,ya;a9eo,iE;ng,tL;a2e1o0;lDy;an,w3;de,smi4y;a0iKol8;ll,z0;el;ail,e0;ne;aith,ern,lo;a0dDmir,ula,ve;rl;a4e3i1ol0;ly;ck,x0;ie;an,ja;i0wn;sy;h0liff,rystal;ari0in,ristian;ty;ak4e3i2r0;an0ook;dy;ll;nedict,rg;er;l0rt;fredo,ma",
  "Actor|Verb": "true\xA6aCb8c5doctor,engineAfool,g3host,judge,m2nerd,p1recruit,scout,ushAvolunteAwi0;mp,tneA;arent,ilot;an,ime;eek,oof,r0uide;adu8oom;ha1o0;ach,nscript,ok;mpion,uffeur;o2u0;lly,tch0;er;ss;ddi1ffili0rchite1;ate;ct",
  "MaleName": "true\xA60:DO;1:CO;2:D7;3:AJ;4:CK;5:BZ;6:CF;7:D3;8:BS;9:AR;A:DB;B:D4;C:94;D:BM;aC9bB7cA7d98e8If82g7Fh6Si6Cj5Ek52l4Fm37n2Uo2Op2Gqu2Er1Ms12t0Gu0Fv08wUxTyJzE;aEor0;cEh9Jkaria,n0C;hFkE;!aC7;ar5UeC6;aMoGuE;sEu2LvBJ;if,uf;nGsFusE;ouf,sE;ef;aEg;s,tE;an,h0;hli,nB8ssY;avi3ho4;aNeLiGoEyaBN;jcie87lfgang,odrow,utE;!er;lEnst1;bGey,fredAlE;aAZiE;am,e,s;e97ur;i,nde9sE;!l8t1;lFyE;l1ne;lEt3;a9Xy;aHiEladimir,ojte7U;cFha0kt67nceErgA5va0;!nt;e3Xt65;lentEn9S;inE;!e;ghBElyss59nax,sm0;aXeShOiMoIrGuFyE;!l3ro6s1;n7r59;avAHeEist0oy,um0;ntA9v5Wy;bGd8RmEny;!as,mEoharu;aCCie,y;iCy;mEt5;!my,othy;adGeoFia0KomE;!as;!do8G;!de5;dHrE;en98rE;an97eEy;ll,n96;!dy;dgh,ha,iEnn3req,tsu4R;cAPka;aUcotSeQhMiKoIpenc3tEur1Xylve96zym1;anGeEua85;f0phBCvEwa84;e5Zie;!islaw,l8;lom1uE;leyma6ta;dElCm1yabonga;!dhart74n8;aGeE;lErm0;d1t1;h7Kne,qu11un,wn,y6;aEbasti0k2Cl4Prg4Mth,ymoAE;m5n;!tE;!ie,y;lFmEnti2Gq58ul;!ke5JmDu4;ik,vato7O;aZeVhe9ViRoIuFyE;an,ou;b7DdFf5pe7KssE;!elBJ;ol3Fy;an,bLc62dJel,geIh0landAmHnGry,sFyE;!ce;coe,s;!aA1nD;an,eo;l45r;er78g3n8olfo,riE;go;bDeAQ;cEl8;ar6Ic6HhFkEo;!ey,ie,y;a8Vie;gFid,ubByEza;an1KnZ;g9SiE;na9Os;ch6Qfa4lImHndGpha4sFul,wi2HyE;an,mo6U;h7Jm5;alAXol2U;iACon;f,ph;ent2inE;cy,t1;aJeHhilGier6TrE;aka18eE;m,st1;!ip,lip;dA4rcy,tE;ar,e3Er1Y;b4Hdra73tr6JulE;!o19;ctav3Di3liv3m9Yndrej,rIsFtEum7wB;is,to;aFc7k7m0vE;al5S;ma;i,vM;aMeKiGoEu38;aEel,j5l0ma0r3I;h,m;cFg4i46kEl2R;!au,h7Gola;hEkEolC;olC;al,d,il,ls1vE;il8J;hom,tE;e,hE;anEy;!a4i4;a00eXiNoIuFyE;l2Gr1;hamFr6KstaE;fa,p54;ed,mI;di0Xe,hamGis2CntFsEussa;es,he;e,y;ad,ed,mE;ad,ed;cJgu4hai,kHlGnFtchE;!e9;a7Uik;house,o0Ct1;ae5Oe9NolE;aj;ah,hE;aFeE;al,l;el,l;hFlv2rE;le,ri9v2;di,met;ay0hUjd,ks2AlSmadXnRrLs1tGuricFxE;imilianAwe9;e,io;eHhFiCtEus,yC;!eo,hew,ia;eEis;us,w;j,o;cIio,kHlGqu6Ysha9tEv2;iEy;!m,n;in,on;el,oQus;!el91oPus;iHu4;achEcolm,ik;ai,y;amFdi,eEmoud;sh;adEm5G;ou;aXeRiPlo39oLuFyE;le,nd1;cHiGkEth3uk;aEe;!s;gi,s,z;as,iaE;no;g0nn7BrenGuEv81we9;!iE;e,s;!zo;am,oE;n4r;a7Uevi,la4AnIonHst3thaGvE;eEi;nte;bo;!a6Del;!ny;mFnd1rEur54wr54;ry,s;ar,o4Y;aMeIhal7GiFristEu4Ky6J;i0o54;er0p,rE;k,ollE;os;en0iGnErmit,v3U;!dr3XnEt1;e18y;r,th;cp3j5m5Sna6OrFsp7them,uE;ri;im,l;a01eViToHuE;an,lEst2;en,iE;an,en,o,us;aOeMhnLkubCnJrHsE;eFhEi7Wue;!ua;!ph;dEge;i,on;!aEny;h,s,th55;!ath54ie,nD;!l,sEy;ph;o,qu2;an,mE;!mD;d,ffHrEs5;a5YemFmai6oEry;me,ni0Y;i7Gy;!e5OrE;ey,y;cLdBkJmIrGsFvi3yE;dBs1;on,p3;ed,od,rEv4V;e5Bod;al,es4Mis1;a,e,oEub;b,v;ob,quE;es;aXbRchiQgOkeNlija,nuMonut,rKsGtEv0;ai,suE;ki;aFha0i70maEsac;el,il;ac,iaE;h,s;a,vinEw2;!g;k,nngu5F;!r;nacEor;io;ka;ai,rahE;im;aQeKoJuEyd7;be2FgHmber4KsE;eyFsE;a2e2;in,n;h,o;m3ra36sse2wa40;aIctHitHnrFrE;be28m0;iEy;!q0Z;or;th;bMlLmza,nKo,rGsFyE;a47dB;an,s0;lGo4Nry,uEv8;hi44ki,tE;a,o;an,ey;k,s;!im;ib;aWeSiQlenPoMrIuE;ilFsE;!tavo;herme,lerE;mo;aGegEov3;!g,orE;io,y;dy,h5K;nzaFrE;an,d1;lo;!n;lbe4Xno,oE;rg37van4Y;oGrE;aEry;ld,rdA;ffr8rge;brFlBrEv2;la14r3Hth,y;e33ielE;!i5;aSePiNlLorrest,rE;anFedEitz;!dDer11r11;cGkE;ie,lE;in,yn;esLisE;!co,z2W;etch3oE;yd;d4lEonn;ip;deriFliEng,rnan05;pe,x;co;bi0di,hd;dYfrXit0lSmLnIo2rGsteb0th0uge6vEymBzra;an,eE;ns,re2X;gi,i0AnErol,v2w2;estAie;oFriqEzo;ue;ch;aJerIiFmE;aIe2Q;lErh0;!iE;o,s;s1y;nu4;be0Bd1iGliFm3t1viEwood;n,s;ot1Ss;!as,j4FsE;ha;a2en;!d2Vg7mHoFuFwE;a26in;arE;do;oWuW;a02eRiPoHrag0uGwFylE;an,l0;ay6ight;a6dl8nc0st2;minHnFri0ugEvydCy29;!lC;!a2HnEov0;e9ie,y;go,iFykC;as;cEk;!k;armuEll1on,rk;id;andNj0lbeMmetri5nKon,rIsGvFwExt3;ay6ey;en,in;hawn,moE;nd;ek,rE;ick;is,nE;is,y;rt;re;an,le,mLnKrGvE;e,iE;!d;en,iGne9rEyl;eEin,yl;l36n;n,o,us;!i4ny;iEon;an,en,on;a08e06hYiar0lOoJrHuFyrE;il,us;rtE;!is;aEistob0S;ig;dy,lHnFrE;ey,neli5y;or,rE;ad;by,e,in,l2t1;aIeGiEyK;fEnt;fo0Et1;meEt5;nt;rGuFyE;!t1;de;enE;ce;aIeGrisE;!toE;ph3;st3;er;d,rEs;b4leE;s,y;cEdric,s7;il;lHmer1rE;ey,lFro9y;ll;!os,t1;eb,v2;a07eZiVlaUoSrFuEyr1;ddy,rtL;aMeHiGuFyE;an,ce,on;ce,no;an,ce;nFtE;!t;dFtE;!on;an,on;dFndE;en,on;!foEl8y;rd;bby,rEyd;is;i6ke;bGlFshE;al;al,lD;ek;nIrEshoi;at,nFtE;!r1C;aEie;rdA;!iFjam2nD;ie,y;to;kaNlazs,nIrE;n8rEt;eEy;tt;ey;dEeF;ar,iE;le;ar17b0Vd0Rf0Pgust2hm0Mi0Jja0Il03mZnSputsiRrIsaHugust5veFyEziz;a0kh0;ry;us;hi;aLchKiJjun,maInGon,tEy0;hEu09;ur;av,oE;ld;an,ndA;!el,ki;ie;ta;aq;as,dIgelAtE;hony,oE;i6nE;!iAy;ne;er,reEy;!as,i,s,w;iGmaEos;nu4r;el;ne,r,t;aRbeQdBeKfIi,lHonGphZt1vE;aOin;on;so,zo;an,en;onVrE;ed;c,jaHksandGssaHxE;!andE;er,ru;ar,er;ndE;ro;rtA;dd2n;ni;dBm7;ar;en;ad,eE;d,t;in;onE;so;aFi,olfAri0vik;!o;mEn;!a;dIeHraFuE;!bakr,lfazl;hEm;am;!l;allJelGoulaye,ulE;!lErG;ah,o;! rE;ahm0;an;ah;av,on",
  "Uncountable": "true\xA60:2Z;1:2F;2:2M;3:34;4:3D;a2Xb2Oc2Cd25e1Uf1Qg1Hh19i14j11k0Zl0Um0Kn0Go0Fp06r02sNtBuran2Mv9w5you gu0H;a7his1Ai6oo5;d,l;ldlife,ne;rmAt2;apor,ernacul2Ci5;neg2Bol1Rtae;eFhDiCoAr6un5yranny;a,gst1E;aff2Rea1No6ue nor5;th;o0Bu5;bleshoot0se1Wt;night,othpas1Ywn5;foGsfoG;me off,n;er5und2;e,mod2V;a,nnis;aGcFeEhCiBkiAo9p8t6u5weepstak1;g1Xnshi2Kshi;ati0Be5;am,el;ace2Neci1;ap,cc2meth0;n,ttl1;lk;eep,ingl1o5;pp0r1E;lf,na1Iri1;ene1Misso1E;d0Yfe3l6nd,t5;i0Kurn;m1Wt;abi1e6ic5;e,ke17;c5i03laxa13search;ogni12rea12;aBeAhys9luto,o7re5ut3;amble,mis1s5ten22;en21s0N;l5rk;i2Al0GyJ; 18i4;a26tr0H;nt5rk0ti0O;i1s;bstetri4vercrowd0xyg0B;a7e6owada5utella;ys;ptu1Qws;il poli01tional securi3;aCeAo7u5;m5s1J;ps;n5o1M;ey,o5;gamy;a5cha0Glancholy,rchandi1Jtallurgy;sl1t;chine5g1Cj1Jrs,thema1S; learn0ry;aught2e8i7ogi6u5;ck,g14;c,s1O;ce,ghtn0nguis1NteratYv2;ath2isXss;ara0GindergartRn5;icke0Cowled10;e5upit2;a5llyfiIwel0I;ns;ce,gnor8mp7n5;forma02ter5;net,sta09;atiUort5rov;an1A;a9e8isto0Bo5ung2;ckey,mework,ne6o5rseradiAspitali3use arrest;ky;s3y;adquarteZre;ir,libut,ppiJs5;hi5te;sh;eneAl8o7r5um,ymnas13;a5e01;niWss;lf,re;ut5yce0H;en; 5ti4;edit0po5;ol;aPeel0icHlour,o6urnit5;ure;od,rgive5uri2wl;ness;arEcono0NducaDlectrBn9quipAthi4very8x5;ist6per5;ti0D;en0L;body,o0Ath0;joy5tertain5;ment;ici3o5;ni4;tiU;nings,th;emi04i8o6raugh5ynas3;ts;pe,wnstai5;rs;abet1ce,s5;hon01repu5;te;aFelciEhCivi4lAo5urrency;al,ld w8mmenta7n5ral,ttKuscoD;fusiJt 5;ed;ry;ar;assi4oth1;es;aos,e5;eOw0;us;d,rQ;aAi8lood,owl0read7u5;nt0tt2;er;!th;lliarLs5;on;g5ss;ga5;ge;cMdviLeroIirHmDn8ppeal court,r6spi5thleN;rin;ithmet5sen5;ic;i8y5;o6th0;ing;ne;se;en7n5;es3;ty;ds;craft;bi4d5nau9;yna5;mi4;ce;id,ous5;ti4;cs",
  "Infinitive": "true\xA60:9G;1:9T;2:AD;3:90;4:9Z;5:84;6:AH;7:A9;8:92;9:A0;A:AG;B:AI;C:9V;D:8R;E:8O;F:97;G:6H;H:7D;a94b8Hc7Jd68e4Zf4Mg4Gh4Ai3Qj3Nk3Kl3Bm34nou48o2Vp2Equ2Dr1Es0CtZuTvRwI;aOeNiLors5rI;eJiI;ng,te;ak,st3;d5e8TthI;draw,er;a2d,ep;i2ke,nIrn;d1t;aIie;liADniAry;nJpI;ho8Llift;cov1dJear8Hfound8DlIplug,rav82tie,ve94;eaAo3X;erIo;cut,go,staAFvalA3w2G;aSeQhNoMrIu73;aIe72;ffi3Smp3nsI;aBfo7CpI;i8oD;pp3ugh5;aJiJrIwaD;eat5i2;nk;aImA0;ch,se;ck3ilor,keImp1r8L;! paD;a0Ic0He0Fh0Bi0Al08mugg3n07o05p02qu01tUuLwI;aJeeIim;p,t5;ll7Wy;bNccMffLggeCmmKppJrI;mouFpa6Zvi2;o0re6Y;ari0on;er,i4;e7Numb;li9KmJsiIveD;de,st;er9it;aMe8MiKrI;ang3eIi2;ng27w;fIng;f5le;b,gg1rI;t3ve;a4AiA;a4UeJit,l7DoI;il,of;ak,nd;lIot7Kw;icEve;atGeak,i0O;aIi6;m,y;ft,ng,t;aKi6CoJriIun;nk,v6Q;ot,rt5;ke,rp5tt1;eIll,nd,que8Gv1w;!k,m;aven9ul8W;dd5tis1Iy;a0FeKiJoI;am,t,ut;d,p5;a0Ab08c06d05f01group,hea00iZjoi4lXmWnVpTq3MsOtMup,vI;amp,eJiIo3B;sEve;l,rI;e,t;i8rI;ie2ofE;eLiKpo8PtIurfa4;o24rI;aHiBuctu8;de,gn,st;mb3nt;el,hra0lIreseF;a4e71;d1ew,o07;aHe3Fo2;a7eFiIo6Jy;e2nq41ve;mbur0nf38;r0t;inKleBocus,rJuI;el,rbiA;aBeA;an4e;aBu4;ei2k8Bla43oIyc3;gni39nci3up,v1;oot,uI;ff;ct,d,liIp;se,ze;tt3viA;aAenGit,o7;aWerUinpoiFlumm1LoTrLuI;b47ke,niArIt;poDsuI;aFe;eMoI;cKd,fe4XhibEmo7noJpo0sp1tru6vI;e,i6o5L;un4;la3Nu8;aGclu6dJf1occupy,sup0JvI;a6BeF;etermi4TiB;aGllu7rtr5Ksse4Q;cei2fo4NiAmea7plex,sIva6;eve8iCua6;mp1rItrol,ve;a6It6E;bOccuNmEpMutLverIwe;l07sJtu6Yu0wI;helm;ee,h1F;gr5Cnu2Cpa4;era7i4Ipo0;py,r;ey,seItaH;r2ss;aMe0ViJoIultiply;leCu6Pw;micJnIspla4;ce,g3us;!k;iIke,na9;m,ntaH;aPeLiIo0u3N;e,ke,ng1quIv5;eIi6S;fy;aKnIss5;d,gI;th5;rn,ve;ng2Gu1N;eep,idnJnI;e4Cow;ap;oHuI;gg3xtaI;po0;gno8mVnIrk;cTdRfQgeChPitia7ju8q1CsNtKun6EvI;a6eIo11;nt,rt,st;erJimi6BoxiPrI;odu4u6;aBn,pr03ru6C;iCpi8tIu8;all,il,ruB;abEibE;eCo3Eu0;iIul9;ca7;i7lu6;b5Xmer0pI;aLer4Uin9ly,oJrI;e3Ais6Bo2;rt,se,veI;riA;le,rt;aLeKiIoiCuD;de,jaInd1;ck;ar,iT;mp1ng,pp5raIve;ng5Mss;ath1et,iMle27oLrI;aJeIow;et;b,pp3ze;!ve5A;gg3ve;aTer45i5RlSorMrJuI;lf4Cndrai0r48;eJiIolic;ght5;e0Qsh5;b3XeLfeEgJsI;a3Dee;eIi2;!t;clo0go,shIwa4Z;ad3F;att1ee,i36;lt1st5;a0OdEl0Mm0FnXquip,rWsVtGvTxI;aRcPeDhOiNpJtIu6;ing0Yol;eKi8lIo0un9;aHoI;it,re;ct,di7l;st,t;a3oDu3B;e30lI;a10u6;lt,mi28;alua7oI;ke,l2;chew,pou0tab19;a0u4U;aYcVdTfSgQhan4joy,lPqOrNsuMtKvI;e0YisI;a9i50;er,i4rI;aHenGuC;e,re;iGol0F;ui8;ar9iC;a9eIra2ulf;nd1;or4;ang1oIu8;r0w;irc3lo0ou0ErJuI;mb1;oaGy4D;b3ct;bKer9pI;hasiIow1;ze;aKody,rI;a4oiI;d1l;lm,rk;ap0eBuI;ci40de;rIt;ma0Rn;a0Re04iKo,rIwind3;aw,ed9oI;wn;agno0e,ff1g,mi2Kne,sLvI;eIul9;rIst;ge,t;aWbVcQlod9mant3pNru3TsMtI;iIoDu37;lJngI;uiA;!l;ol2ua6;eJlIo0ro2;a4ea0;n0r0;a2Xe36lKoIu0S;uIv1;ra9;aIo0;im;a3Kur0;b3rm;af5b01cVduBep5fUliTmQnOpMrLsiCtaGvI;eIol2;lop;ch;a20i2;aDiBloIoD;re,y;oIy;te,un4;eJoI;liA;an;mEv1;a4i0Ao06raud,y;ei2iMla8oKrI;ee,yI;!pt;de,mIup3;missi34po0;de,ma7ph1;aJrief,uI;g,nk;rk;mp5rk5uF;a0Dea0h0Ai09l08oKrIurta1G;a2ea7ipp3uI;mb3;ales4e04habEinci6ll03m00nIrro6;cXdUfQju8no7qu1sLtKvI;eIin4;ne,r9y;aHin2Bribu7;er2iLoli2Epi8tJuI;lt,me;itu7raH;in;d1st;eKiJoIroFu0;rm;de,gu8rm;ss;eJoI;ne;mn,n0;eIlu6ur;al,i2;buCe,men4pI;eIi3ly;l,te;eBi6u6;r4xiC;ean0iT;rcumveFte;eJirp,oI;o0p;riAw;ncIre5t1ulk;el;a02eSi6lQoPrKuI;iXrIy;st,y;aLeaKiJoad5;en;ng;stfeLtX;ke;il,l11mba0WrrMth1;eIow;ed;!coQfrie1LgPhMliLqueaKstJtrIwild1;ay;ow;th;e2tt3;a2eJoI;ld;ad;!in,ui3;me;bysEckfi8ff3tI;he;b15c0Rd0Iff0Ggree,l0Cm09n03ppZrXsQttOuMvJwaE;it;eDoI;id;rt;gIto0X;meF;aIeCraB;ch,in;pi8sJtoI;niA;aKeIi04u8;mb3rt,ss;le;il;re;g0Hi0ou0rI;an9i2;eaKly,oiFrI;ai0o2;nt;r,se;aMi0GnJtI;icipa7;eJoIul;un4y;al;ly0;aJu0;se;lga08ze;iKlI;e9oIu6;t,w;gn;ix,oI;rd;a03jNmiKoJsoI;rb;pt,rn;niIt;st1;er;ouJuC;st;rn;cLhie2knowled9quiItiva7;es4re;ce;ge;eQliOoKrJusI;e,tom;ue;mIst;moJpI;any,liA;da7;ma7;te;pt;andPduBet,i6oKsI;coKol2;ve;liArt,uI;nd;sh;de;ct;on",
  "Adjective": "true\xA60:AI;1:BS;2:BI;3:BA;4:A8;5:84;6:AV;7:AN;8:AF;9:7H;A:BQ;B:AY;C:BC;D:BH;E:9Y;aA2b9Ec8Fd7We79f6Ng6Dh60i4Wj4Vk4Sl4Hm40n3Oo35p2Nquart7Pr2Cs1Dt14uSvOwFye28;aMeKhIiHoF;man5oFrth7G;dADzy;despreB1n w97s86;acked1HoleF;!sa6;ather1QeFll o70ste1D;!k5;nt1Jst6Ate4;aHeGiFola5S;bBUce versa,gi3Kle;ng67rsa5Q;ca1gBSluAV;lt0PnLpHrGsFttermoBL;ef9Ku3;b96ge1; Hb31pGsFtiAH;ca6et,ide d4Q;er,i85;f51to da2;a0Fbeco0Hc0Bd04e02f01gu1WheaBGiXkn4NmUnTopp06pRrNsJtHus0wF;aFiel3J;nt0rra0P;app0eXoF;ld,uS;eHi36o59pGuF;perv06spec38;e1ok9O;en,ttl0;eFu5;cogn06gul2QlGqu84sF;erv0olv0;at0en32;aFrecede0E;id,rallel0;am0otic0;aFet;rri0tF;ch0;nFq25vers3;sur0terFv7U;eFrupt0;st0;air,inish0orese98;mploy0n7Ov97xpF;ect0lain0;eHisFocume01ue;clFput0;os0;cid0rF;!a8Scov9ha8Jlyi8nea8Gprivileg0sMwF;aFei9I;t9y;hGircumcFonvin2T;is0;aFeck0;lleng0rt0;b1Zppea85ssuGttend0uthorF;iz0;mi8;i49ra;aLeIhoHip 24oGrF;anspare1encha1i2;geth9leADp notch,rpB;rny,ugh6H;ena8DmpGrFs6U;r48tia4;eCo8P;leFst4M;nt0;a0Cc08e06h05i03ki02l00mug,nobbi4XoWpSqueami4XtKuFymb94;bHccinAi generis,pFr5;erFre7N;! dup9b,vi70;du0li7Lp6IsFurb7J;eq9Atanda9X;aLeKi15o2PrGubboFy4Q;rn;aightGin5GungF; o2M; fFfF;or7U;adfa9Ori6;lwa6Etu81;arHeGir6MlendBot Fry;on;c3Oe1Q;k5se; call0lub6mb9phistic14rHuFviT;ndFth19;proof;dBry;e61ipF;pe4shod;ll0n d7S;g2HnF;ceEg6ist9;am3Te9;co1Zem5lfFn6Bre7; suf4Yi44;aGholFient3A;ar5;rlFt4B;et;cr0me,tisfac7G;aOeIheumatoBiGoF;bu90tt7Hy3;ghtFv3;-1Sf6Y;cJdu8QlInown0pro6AsGtF;ard0;is48oF;lu2na1;e1Suc46;alcit8Ye1ondi2;bBci3mpa1;aSePicayu7laOoNrGuF;bl7Unjabi,z36;eKiIoF;b7WfGmi4ApFxi2M;er,ort82;a7uD;maFor,sti7va2;!ry;ciDexis0Ima2CpaB;in56puli8H;cBid;ac2Znt 3JrFti2;ma41tFv7X;!i40;i2ZrFss7S;anoBtF;-5YiF;al,s5W;bSffQkPld OnMrLth9utKverF;!aIbMdHhGni76seas,t,wF;ei75rou75;a64e7B;ue;ll;do1Ger,si6B;d3Rg2Aotu60; bFbFe on o7g3Vli7;oa81;fashion0school;!ay; gua7YbFha5Vli7;eat;eHligGsF;ce7er0So1C;at0;diFse;a1e1;aOeNiMoGuF;anc0de; moEnHrthFt6W;!eFwe7M;a7Lrn;chaGdescri7Jprof31sF;top;la1;ght5;arby,cessa4ighbor5wlyw0xt;k0usiaFv3;ti8;aQeNiLoHuF;dIltiF;facet0p6;deHlGnFot,rbBst;ochro4Yth5;dy;rn,st;ddle ag0nF;dbloZi,or;ag9diocEga,naGrFtropolit4R;e,ry;ci8;cIgenta,inHj0Fkeshift,mmGnFri4Pscu62ver18;da5Ey;ali4Mo4V;!stream;abEho;aOeLiIoFumberi8;ngFuti1S;stan3StF;erm,i4I;ghtGteraF;l,ry,te;heart0wei5P;ft-JgFss9th3;al,eFi0M;nda4;nguBps0te5;apGind5noF;wi8;ut;ad0itte4uniW;ce co0Hgno6Nll0Cm04nHpso 2VrF;a2releF;va1; ZaYcoWdReQfOgrNhibi4Si05nMoLsHtFvalu5N;aAeF;nDrdepe2L;a7iGolFuboI;ub6ve1;de,gF;nifica1;rdi5O;a2er;own;eriIiLluenVrF;ar0eq5I;pt,rt;eHiGoFul1P;or;e,reA;fiFpe27termi5F;ni2;mpFnsideCrreA;le2;ccuCdeq5Fne,ppr4K;fFsitu,vitro;ro1;mJpF;arHeGl16oFrop9;li2r12;n2MrfeA;ti3;aGeFi19;d4CnD;tuE;egGiF;c0ZteC;al,iF;tiF;ma2;ld;aOelNiLoFuma7;a4meInHrrGsFur5;ti6;if4F;e59o3V; ma3HsF;ick;ghfalut2IspF;an4A;li01pf34;i4llow0ndGrdFtN; 06coEworki8;sy,y;aMener45iga3Clob3oLrGuF;il1Ong ho;aGea1GizF;zl0;cGtF;ef2Vis;ef2U;ld3Aod;iFuc2D;nf2R;aVeSiQlOoJrF;aGeFil5ug3;q43tf2O;gFnt3S;i6ra1;lk13oHrF; keeps,eFge0Vm9tu41;g0Ei2Ds3R;liF;sh;ag4Mowe4uF;e1or45;e4nF;al,i2;d Gmini7rF;ti6ve1;up;bl0lDmIr Fst pac0ux;oGreacF;hi8;ff;ed,ili0R;aXfVlTmQnOqu3rMthere3veryday,xF;aApIquisi2traHuF;be48lF;ta1;!va2L;edRlF;icF;it;eAstF;whi6; Famor0ough,tiE;rou2sui2;erGiF;ne1;ge1;dFe2Aoq34;er5;ficF;ie1;g9sF;t,ygF;oi8;er;aWeMiHoGrFue;ea4owY;ci6mina1ne,r31ti8ubQ;dact2Jfficult,m,sGverF;ge1se;creGePjoi1paCtF;a1inA;et,te; Nadp0WceMfiLgeneCliJmuEpeIreliAsGvoF;id,ut;pFtitu2ul1L;eCoF;nde1;ca2ghF;tf13;a1ni2;as0;facto;i5ngero0I;ar0Ce09h07i06l05oOrIuF;rmudgeon5stoma4teF;sy;ly;aIeHu1EystalF; cleFli7;ar;epy;fFv17z0;ty;erUgTloSmPnGrpoCunterclVveFy;rt;cLdJgr21jIsHtrF;aFi2;dic0Yry;eq1Yta1;oi1ug3;escenFuN;di8;a1QeFiD;it0;atoDmensuCpF;ass1SulF;so4;ni3ss3;e1niza1;ci1J;ockwiD;rcumspeAvil;eFintzy;e4wy;leGrtaF;in;ba2;diac,ef00;a00ePiLliJoGrFuck nak0;and new,isk,on22;gGldface,naF; fi05fi05;us;nd,tF;he;gGpartisFzarE;an;tiF;me;autifOhiNlLnHsFyoN;iWtselF;li8;eGiFt;gn;aFfi03;th;at0oF;v0w;nd;ul;ckwards,rF;e,rT; priori,b13c0Zd0Tf0Ng0Ihe0Hl09mp6nt06pZrTsQttracti0MuLvIwF;aGkF;wa1B;ke,re;ant garGeraF;ge;de;diIsteEtF;heFoimmu7;nt07;re;to4;hGlFtu2;eep;en;bitIchiv3roHtF;ifiFsy;ci3;ga1;ra4;ry;pFt;aHetizi8rF;oprF;ia2;llFre1;ed,i8;ng;iquFsy;at0e;ed;cohKiJkaHl,oGriFterX;ght;ne,of;li7;ne;ke,ve;olF;ic;ad;ain07gressiIi6rF;eeF;ab6;le;ve;fGraB;id;ectGlF;ue1;ioF;na2; JaIeGvF;erD;pt,qF;ua2;ma1;hoc,infinitum;cuCquiGtu3u2;al;esce1;ra2;erSjeAlPoNrKsGuF;nda1;e1olu2trF;aAuD;se;te;eaGuF;pt;st;aFve;rd;aFe;ze;ct;ra1;nt",
  "Pronoun": "true\xA6'em,elle,h3i2me,she4th0us,we,you;e0ou;e,m,y;!l,t;e0im;!'s",
  "Preposition": "true\xA6-,aPbMcLdKexcept,fIinGmid,notwithstandiWoDpXqua,sCt7u4v2w0;/o,hereSith0;! whHin,oW;ersus,i0;a,s-a-vis;n1p0;!on;like,til;h1ill,oward0;!s;an,ereby,r0;ough0u;!oM;ans,ince,o that,uch G;f1n0ut;!to;!f;! 0to;effect,part;or,r0;om;espite,own,u3;hez,irca;ar1e0oBy;sides,tween;ri7;bo8cross,ft7lo6m4propos,round,s1t0;!op;! 0;a whole,long 0;as;id0ong0;!st;ng;er;ut",
  "SportsTeam": "true\xA60:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls",
  "Unit": "true\xA6a09b06cZdYexXfTgRhePin00joule0DkMlJmDnan0AoCp9quart0Dsq ft,t7volts,w6y2ze3\xB01\xB50;g,s;c,f,n;dXear1o0;ttT; 0s 0;old;att06b;erPon0;!ne04;ascals,e1i0;cZnt02;rcent,tL;hms,uI;/s,e4i0m\xB2,\xB2,\xB3;/h,cro2l0;e0liM;!\xB2;grNsT;gEtL;it1u0;menSx;erRreR;b5elvins,ilo1m0notQ;/h,ph,\xB2;!byIgrGmEs;ct0rtzN;aLogrE;allonLb0ig5rD;ps;a2emtGl0t6; oz,uid ou0;nceH;hrenheit,radG;aby9;eci3m1;aratDe1m0oulombD;\xB2,\xB3;lsius,nti0;gr2lit1m0;et0;er8;am7;b1y0;te5;l,ps;c2tt0;os0;econd1;re0;!s",
  "PhrasalVerb": "true\xA60:92;1:96;2:8H;3:8V;4:8A;5:83;6:85;7:98;8:90;9:8G;A:8X;B:8R;C:8U;D:8S;E:70;F:97;G:8Y;H:81;I:7H;J:79;K:4G;a9Gb7Vc6Sd6Me6Kf5Ig51h4Ciron0j48k41l3Fm32n2Zo2Xp2Dquiet Hr1Ys0Lt00uYvacuu6RwOyammerBzL;ero Dip MonL;e0k0;by,ov9up;aReNhMiLor0Nrit1A;mp0n3Gpe0r5s5;ackAeel Di0T;aMiLn34;gh 3Xrd0;n Dr L;do1in,oJ;it 7Ak5lk Mrm 6Ash Lt84v60;aw3do1o7up;aw3in,oC;rgeBsL;e 2herE;a01eZhWiSoRrNuLypQ;ckErn L;do1in,oJup;aMiLot0y 31;ckl80p F;ck HdL;e 5Z;n7Xp 3Fs5K;ck NdMe Lghten 6me0p o0Sre0;aw3ba4do1in,up;e Iy 2;by,oG;ink Mrow L;aw3ba4in,up;ba4ov9up;aLe 78ll63;m 2r 5N;ckBke Mlk L;ov9shit,u48;aLba4do1in,leave,o66up;ba4ft9pa6Aw3;a0Wc0Ue0Nh0Ji0Gl0Am09n08o07p02quar5HtRuPwL;earNiL;ngMtch L;aw3ba4o8L; by;cLi6Cm 2ss0;k 65;aSeRiQoOrLud36;aigh2Eet76iL;ke 7Tng L;al6Zup;p Lrm2G;by,in,oG;cKnKr 2tc4O;p F;cKmp0nd MrLveAy 2P;e Ht 2M;ba4do1up;arKeOiNlMrLurB;ead0ingBuc5;a49it 6I;c5ll o3Dn 2;ak Fe1Yll0;aKber 2rt0und like;ap 5Wow Duggl5;ash 6Ooke0;eep OiLow 6;cMp L;o6Eup;e 69;in,oL;ff,v9;de1Agn 4OnLt 6Hz5;gLkE; al6Ble0;aNoLu5X;ot Lut0w 7N;aw3ba4f48oC;cKdeEk6FveA;e Qll1Ond Prv5tL; Ltl5K;do1foMin,o7upL;!on;ot,r60;aw3ba4do1in,o4Wup;oCto;al67out0rL;ap66ew 6K;ilAv5;aYeViToPuL;b 5Zle0n Lstl5;aMba4do1inLo2Jth4Ou5Q;!to;c2Xr8w3;ll Not MpeAuL;g3Ind18;a2Wf3Po7;ar8in,o7up;ng 69p oLs5;ff,p19;aLelAinEnt0;c6Id L;o3Oup;cKt0;a00eZiXlUoRrPsyc35uL;ll Nn5Lt L;aLba4do1in,oJto48up;pa4Ew3;a3Kdo1in,o22to46up;attleBess LiOop 2;ah2Fon;iMp Lr50u1Hwer 6O;do1in,o6Oup;nt0;aMuL;gEmp 6;ce u21y 6E;ck Lg0le 4Bn 6p5C;oJup;el 5OncilE;c54ir 3An0ss NtMy L;ba4oG; Hc2R;aw3ba4in,oJ;pLw4Z;e4Yt D;aMerd0oL;dAt54;il Hrrow H;aUeRiQoMuL;ddl5ll I;cKnkeyNp 6uthAve L;aLdo1in,o4Mup;l4Ow3; wi4L;ss0x 2;asur5e3TlMss L;a21up;t 6;ke Mn 6rLs2Ax0;k 6ryA;do,fun,oCsure,up;a03eWiRoMuL;ck0st I;aOc4Gg NoLse0;k Lse4E;aft9ba4do1forw38in57o10u47;in,oJ;d 6;e OghtNnMsLve 01;ten F;e 2k 2; 2e47;ar8do1in;aNt MvelL; oC;do1go,in,o7up;nEve L;in,oL;pLut;en;c5p 2sh MtchBughAy L;do1o5A;in4Qo7;eNick Mnock L;do1oCup;oCup;eMy L;in,up;l Ip L;aw3ba4do1f05in,oJto,up;aNoMuL;ic5mpE;ke3Tt H;c44zz 2;a02eXiUoQuL;nMrrLsh 6;y 2;keMt L;ar8do1;r H;lLneErse3L;d Le 2;ba4dLfast,o25up;ear,o1;de Mt L;ba4on,up;aw3o7;aLlp0;d Nl Ir Lt 2;fLof;rom;f11in,o1WuX;cKm 2nMsh0ve Lz2Q;at,it,to;d Mg LkerQ;do1in,o2Uup;do1in,oL;ut,v9;k 2;aZeUive Sloss IoNrMunL; f0S;ab hold,in44ow 2V; Lof 2J;aNb1Nit,oMr8th1JuL;nd9;ff,n,v9;bo7ft9hQw3;aw3bLdo1in,oJrise,up,w3;a4ir2I;ar 6ek0t L;aLb1Gdo1in,o1Dr8up;cMhLl2Hr8t,w3;ead;ross;d aLng 2;bo7;a0Fe08iZlVoRrNuL;ck Le2P;ar8up;eMighten LownBy 2;aw3oG;eLshe29; 2z5;g 2lNol Lrk I;aLwi22;bo7r8;d 6low 2;aMeLip0;sh0;g 6ke0mLrLtten H;e F;gSlQnOrMsLzzle0;h F;e Lm 2;aw3ba4up;d0isL;h 2;e Ll 1V;aw3fQin,o7;ht ba4ure0;eQnMsL;s 2;cNd L;fLoG;or;e D;d06l 2;cPll Lrm0t1I;aNbMdo1in,oLsho0Gth0Avictim;ff,ut,v9;a4ehi2P;pa0D;e L;do1oGup;at Ldge0nd 13y5;in,o7up;aPi1IoOrL;aMess 6op LuO;aw3b04in,oC;gBwB; Ile0ubl1C;m 2;a0Bh06l03oPrMut L;aw3ba4do1oCup;ackBeep MoLy0;ss Dwd0;by,do1in,o0Vup;me OoMuntL; o2B;k 6l L;do1oG;aSbRforPin,oOtLu0P;hMoLrue;geth9;rough;ff,n,ut,v9;th,wL;ard;a4y;paLr8w3;rt;eaMose L;in,oCup;n 6r F;aOeMiL;ll0pE;ck Der Lw F;on,up;t 2;lSncel0rPsNtch MveE; in;o1Oup;h Dt L;doubt,oG;ry MvL;e 09;aw3oJ;l Lm H;aMba4do1oJup;ff,n,ut;r8w3;a0We0NiteAl0Go05rRuL;bblOckl06il0Elk 6ndl06rMsLtNy FzzA;t 01;n 0IsL;t D;e I;ov9;anXeaViMush L;oGup;ghRng L;aOba4do1forNin,oMuL;nd9p;n,ut;th;bo7lLr8w3;ong;teL;n 2;k L;do1in,o7up;ch0;arUg 6iSn5oQrOssNttlMunce Lx D;aw3ba4;e 6; ar8;e H;do1;k Dt 2;e 2;l 6;do1up;d 2;aQeed0oLurt0;cNw L;aw3ba4do1o7up;ck;k L;in,oC;ck0nk0stA; oRaOef 2lt0nd L;do1ov9up;er;up;r Mt L;do1in,oCup;do1o7;ff,nL;to;ck Qil0nNrgMsL;h D;ainBe D;g DkB; on;in,o7;aw3do1in,oCup;ff,ut;ay;ct FdRir0sk NuctionA; oG;ff;ar8o7;ouL;nd; o7;d L;do1oLup;ff,n;wn;o7up;ut",
  "Noun|Gerund": "true\xA60:27;1:26;2:1X;3:1J;4:1Z;a25b1Oc1Cd16en14f0Yg0Wh0Ti0Rjog20k0Pl0Lm0In0Go0Cp05ques08rWsFtBu9volunt15w5y17zo2;a7ed1Si3or6r5;ap1Oest1Ci1;ki0r1O;i1r2s1Utc1U;nder5pri23;st1Mta4;al4e7hin4i6ra5y1J;c4di0i2v0Z;mi0p1H;a1Ys1;aKcHeGhEin1PkatClZmo4nowBpeAt8u6w5;ea3im1U;f02r5;fi0vi0J;a1Lretc1Ju5;d1BfJ;l0Xn1C;b6i0;eb5i0;oar19;ip15o5;rte2u1;a1r0At1;h6o3re5;a1He2;edu0Ooo0O;i0Nyi0;aCe8i11o6u5;li0n2;o5wi0;fi0;a7c6hear1Cnde3por1struct5;r1Au3;or0Vyc0G;di0so2;p0Qti0;aAeacek9la8o6r5ublis0X;a0Peten0Rin1oces16;iso2si5;tio2;n2yi0;ee0K;cka0Tin1rt0K;f7pe6rgani5vula1;si0zi0;ni0ra1;fe3;e5ur0W;gotia1twor4;a6e5i2onito3;e1ssa0L;nufactu3rke1;a7ea6i5od0Jyi0;cen0Qf1s1;r2si0;n09ug0E;i5n0J;c4lS;ci0magi2n5ro2;nova1terac1;andPea1i6o5un1;l03wO;ki0ri0;athe3rie5ui01;vi0;ar0CenHi7l6or5ros1unZ;ecas1mat1;ir1ooX;l6n5;anDdi0;i0li0;di0gin5;ee3;a8eba1irec1oub1r6umOw5;elB;awi0es04i5;n4vi0;n5ti0;ci0;aEelebra1hClAo7r5ur6;aw5osZ;li0;a6di0lo3mplai2n5o4pi0ve3;duc1sul1;cLti0;apCea3imHo5ubH;ni0tJ;a5ee3;n1t1;m8s1te3;ri0;aIeFitDlCoAr8u5;il8ll6r5;pi0;yi0;an5;di0;a1m5o4;bi0;esGoa1;c5i0;hi0;gin2lon5t1;gi0;ni0;bys6c4ki0;ki0;it1;c8dverti7gi0rg6ssu5;mi0;ui0;si0;coun1ti0;ti0;ng",
  "ProperNoun": "true\xA6barbie,c4diego,e3f2iron maiden,kirby,m0nis,riel,stevens;ercedes,i0;ckey,ssy;inn,lorence,ranco;lmo,uro;atalina,hristi",
  "Ordinal": "true\xA6eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th",
  "Cardinal": "true\xA6bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions",
  "Multiple": "true\xA6b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion",
  "City": "true\xA60:77;1:64;2:6J;3:6M;4:5V;a6Bb56c4Ld4Be47f3Zg3Kh3Ci33j2Yk2Hl25m1Nn1Do1Ap0Xq0Vr0Os05tRuQvLwDxiBy9z5;a7h5i4Puri4R;a5e5ongsh0;ng3K;greb,nzib5J;ang2e5okoha3Vunfu;katerin3Krev0;a5n0R;m5Kn;arsBeAi6roclBu5;h0xi,zh5S;c7n5;d5nipeg,terth4;hoek,s1N;hi62kl3D;l66xford;aw;a8e6i5ladivost5Polgogr6O;en3lni6V;ni24r5;n2o3saill4Q;lenc4Zncouv3Vr3ughn;lan bat1Erumqi,trecht;aFbilisi,eEheDiBo9r7u5;l23n66r5;in,ku;i5ondh65;es54poli;kyo,m32ron1Rulo5;n,uS;an5jua3l2Wmisoa6Era3;j4Wshui; hag65ssaloni2K;gucigal28hr0l av1W;briz,i6llinn,mpe59ng5rtu,shk2U;i3Hsh0;an,chu1n0p2Hyu0;aEeDh8kopje,owe1It7u5;ra5zh50;ba0It;aten is58ockholm,rasbou6Auttga2Y;an8e6i5;jiazhua1llo1m60y0;f53n5;ya1zh4K;gh3Nt4T;att48o1Yv47;cramen18int ClBn5o paulo,ppo3Urajevo; 7aa,t5;a 5o domin3H;a3fe,m1O;antonBdie3Ffrancisco,j5ped3Qsalvad0L;o5u0;se;em,t lake ci5Iz28;lou5Bpeters27;aAe9i7o5;me,sar5t5C;io;ga,o5yadh;! de janei3H;cife,ims,nn3Lykjavik;b4Uip4lei2Knc2Rwalpindi;ingdao,u5;ez2i0R;aFeEhDiCo9r7u6yong5;ya1;eb5Bya1;a5etor3O;g54to;rt5zn0; 5la4Eo;au prin0Nelizabe26sa04;ls3Rrae5Ctts28;iladelph3Inom pe1Coenix;ki1r23tah tik3G;dua,lerZnaji,r4Qt5;na,r34;ak46des0Lm1Or6s5ttawa;a3Xlo;an,d07;a7ew5ing2Hovosibir1Lyc; 5cast38;del26orlea46taip16;g8iro4Yn5pl2Yshv35v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0Y;aFeCi9o6u5;mb2Cni28sc40;gadishu,nt6s5;c15ul;evideo,pelli1Tre31;ami,l6n16s5;kolc,sissauga;an,waukee;cca,d5lbour2Omph43ndo1Essi3;an,ell5i3;in,\xEDn;cau,drAkass2Tl9n8r5shh4B;aca6ib5rakesh,se2M;or;i1Ty;a4FchFdal10i48;mo;id;aDeAi8o6u5vSy2;anMckn0Pdhia3;n5s angel27;d2g bea1O;brev2Ce3Mma5nz,sb2verpo29;!ss28; ma3Ai5;c5pzig;est17; p6g5ho2Xn0Dusan25;os;az,la34;aHharFiClaipeBo9rak0Eu7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Ilka2Ypavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bIdu3llakuric0Rmpa3Gn6ohsiu1ra5un1Jwaguc0R;c0Qj;d5o,p4;ah1Uy;a7e6i5ohannesW;l1Wn0;dd37rusalem;ip4k5;ar2I;bad0mph1PnBrkutVs8taYz5\u0307zm7;m6tapala5;pa;ir;fah0l6tanb5;ul;am2Zi2H;che2d5;ianap2Mo20;aAe7o5yder2W; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Oupe;ld coa1Bthen5;bu2S;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal29es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,nkirk,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Zr es sala1KugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1Q;lo7n6penhag0Ar5;do1Ok;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr14;ch8sha,zh07;gliari,i9lga8mayenJn6pe town,r5tanO;acCdiff;ber1Ac5;un;ry;ro;aWeNhKirmingh0WoJr9u5;chareTdapeTenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iCl9ng8r5;g6l5n;in;en;aluru,hazi;fa6grade,o horizon5;te;st;ji1rut;ghd0BkFn9ot8r7s6yan n4;ur;el,r07;celo3i,ranquil09;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a05b02cc01ddis aba00gartaZhmedXizawl,lSmPnHqa00rEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a8c5kaOtwerp;hora6o3;na;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 7buquerq6eppo,giers,ma5;ty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg",
  "Region": "true\xA60:2N;1:2T;2:2K;a2Qb2Dc1Zd1Ues1Tf1Rg1Lh1Hi1Cj18k13l10m0Pn07o05pZqWrTsKtFuCv9w5y3zacatec2U;akut0o0Du3;cat2k07;a4est 3isconsin,yomi1M;bengal,vi6;rwick2Bshington3;! dc;er4i3;rgin0;acruz,mont;dmurt0t3;ah,tar3; 2La0X;a5e4laxca1Rripu1Xu3;scaDva;langa1nnessee,x2F;bas0Vm3smNtar25;aulip2Dil nadu;a8i6o4taf11u3ylh1F;ffYrr04s1A;me1Cno1Quth 3;cVdU;ber0c3kkim,naloa;hu2ily;n4skatchew2xo3;ny; luis potosi,ta catari1;a3hode9;j3ngp07;asth2shahi;ingh25u3;e3intana roo;bec,en5reta0R;ara7e5rince edward3unjab; i3;sl0B;i,nnsylv3rnambu0B;an0;!na;axa0Ydisha,h3klaho20ntar3reg6ss0Bx0G;io;aJeDo5u3;evo le3nav0W;on;r3tt17va scot0;f8mandy,th3; 3ampton16;c5d4yo3;rk14;ako1N;aroli1;olk;bras1Mva0Cw3; 4foundland3;! and labrador;brunswick,hamp0Xjers4mexiSyork3;! state;ey;galOyarit;a9eghala0Mi5o3;nta1r3;dov0elos;ch5dlanCn4ss3zor11;issippi,ouri;as geraOneso18;ig2oac2;dhy12harasht0Gine,ni4r3ssachusetts;anhao,i el,ylF;p3toba;ur;anca0Ie3incoln0IouisH;e3iR;ds;a5e4h3omi;aka06ul1;ntucky,ra01;bardino,lmyk0ns0Qr3;achay,el0nata0X;alis5har3iangxi;kh3;and;co;daho,llino6n3owa;d4gush3;et0;ia1;is;a5ert4i3un2;dalFm0D;fordZ;mpYrya1waii;ansu,eorg0lou7oa,u3;an4erre3izhou,jarat;ro;ajuato,gdo3;ng;cesterS;lori3uji2;da;sex;ageTe6o4uran3;go;rs3;et;lawaLrbyK;aEeaDh8o3rimea ,umbr0;ahui6l5nnectic4rsi3ventry;ca;ut;i02orado;la;e4hattisgarh,i3uvash0;apQhuahua;chn4rke3;ss0;ya;ra;lFm3;bridge6peche;a8ihar,r7u3;ck3ryat0;ingham3;shi3;re;emen,itish columb0;h0ja cal7lk6s3v6;hkorto3que;st2;an;ar0;iforn0;ia;dygea,guascalientes,lAndhr8r4ss3;am;izo1kans4un3;achal 6;as;na;a 3;pradesh;a5ber4t3;ai;ta;ba4s3;ka;ma",
  "Country": "true\xA60:39;1:2M;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om3DpZqat1KrXsKtCu6v4wal3yemTz2;a25imbabwe;es,lis and futu2Y;a2enezue32ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2Y;k.,s.2; 28a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Ys and caic1U; and 2-2;toba1K;go,kel0Znga;iw2Wji2nz2S;ki2U;aCcotl1eBi8lov7o5pa2Cri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Rriname;lomon1Wmal0uth 2;afr2JkLsud2P;ak0en0;erra leoEn2;gapo1Xt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele25luc0mart20;epublic of ir0Dom2Duss0w2;an26;a3eHhilippinTitcairn1Lo2uerto riM;l1rtugE;ki2Cl3nama,pua new0Ura2;gu6;au,esti2;ne;aAe8i6or2;folk1Hth3w2;ay; k2ern mariana1C;or0N;caragua,ger2ue;!ia;p2ther19w zeal1;al;mib0u2;ru;a6exi5icro0Ao2yanm05;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagasc00l6r4urit3yot2;te;an0i15;shall0Wtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed01;a5e4i2uxembourg;b2echtenste11thu1F;er0ya;ban0Hsotho;os,tv0;azakh1Ee3iriba03o2uwait,yrgyz1E;rWsovo;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an",
  "Place": "true\xA6a00bYcUdTeSfRgMhLiJjfk,kHlFmDnBorAp8r7s6t3u2vostok,wake isCy0;a0yz;kutGngtze;laanbaatar,pT;ahiti,h0;amWe 0;bronx,hamptons;akhalIeine,fo,oho,under5yd;ed sea,io grande;acifWek,h0itcairn;l,x;ange county,d,inoco;ew eng0ile;land;a0co,ekong,idIuc;gadSlibu,nhattS;a0gw,hr;s,x;osrae,rasnoyar0ul;sk;ax,cn,nd0st;ianLochina;arlem,kg,nd,ovd;a3odavari,re0;at 0enwich;brita0lakC;in;ngAy village;co,ra;urope,verglad8;anube,en,fw,own2xb;dg,gk,h0lt;a1ina0uuk;town;morro,tham;cn,e0kk,rooklyn;l air,verly hills;driadic,frica,m7n2r3sia,tl1zor0;es;!ant2;adyr,tar0;ct0;ic0; oce0;an;ericas,s",
  "WeekDay": "true\xA6fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s",
  "Month": "true\xA6dec0february,july,nov0octo1sept0;em0;ber",
  "Date": "true\xA6ago,on4som4t1week0yesterd5; end,ends;mr1o0;d2morrow;!w;ed0;ay",
  "Duration": "true\xA6centurAd8h7m5q4se3w1y0;ear8r8;eek0k7;!end,s;ason,c5;tr,uarter;i0onth3;llisecond2nute2;our1r1;ay0ecade0;!s;ies,y",
  "FemaleName": "true\xA60:IS;1:IW;2:I5;3:I4;4:IM;5:I9;6:JD;7:GQ;8:J9;9:J5;A:HD;B:HN;C:IE;D:J2;E:II;F:H2;G:C4;H:HP;aGIbFDcDJdCSeBIfB0gAAh9Qi9Dj8Ck7Cl5Wm46n3Ko3Gp34qu33r2Bs16t0Fu0Dv03wWxiUyPzI;aMeJineb,oIsof2;e3Rf2la,ra;h3iLlJna,ynI;ab,ep;da,ma;da,h3iIra;nab;aLeKi0GolB3uJvI;etAonDH;i0na;le0sen2;el,gm3Gn,rGAs8T;aoIme0nyi;m5YyAA;aNendDRhiD8iI;dele9lKnI;if45niIo0;e,f44;a,helmi0lIma;a,ow;ka0nB;aOeLiIusa5;ck82kJlAole7viI;anGenIQ;ky,toriBE;da,lA5rIs0;a,nIoniGV;a,iFH;leInesGV;nI7rI;i1y;g9rIxGW;su5te;aZeVhSiOoMrJuIy3;i,la;acIPiIu0L;c2na,sI;hGta;nIr0H;iGya;aKffaEGnIs6;a,gtiI;ng;!nFHra;aJeIomasi0;a,l9Lo87res1;l2ndolwethu;g9Co85rJssI;!a,ie;eIi,ri8;sa,za;bPlNmLnJrIs6tia0wa0;a60yn;iIya;a,ka,s6;arGe3iIm75ra;!ka;a,iI;a,t6;at6it6;a0Gcarlett,e0ChYiUkye,neza0oStOuJyI;bI2lvi1;ha,mayI5ni7sJzI;an3KetAie,y;anIi8;!a,e,nI;aCe;aKeI;fIl5DphI;an4;cHQr5;b2fiA3m0MnIphi1;d3ia,ja,ya;er3lKmon1nJobh8MtI;a,i;dy;lEHv2;aNeJirIo0risEZy5;a,lDD;ba,e0i5lKrI;iIr6Gyl;!d8Efa;ia,lDP;hd,iNki3nKrJu0w0yI;la,ma,na;i,le9on,ron;aJda,ia,nIon;a,on;!ya;k6mI;!aa;lKrJtaye7YvI;da,inj;e0ife;en1i0ma;anA0bMd3Kh1PiBkLlKmJnd3rIs6vannaC;aCi0;ant6i3;lDEma,ome;ee0in8Ou3;in1ri0;a05e00hYiVoIuthDC;bTcSghRl8GnQsKwJxI;anAUie,y;an,e0;aJeIie,lD; merBIann8ll1marD6t7;!lInn1;iIyn;e,nI;a,dG;da,i,na;ayy8B;hel63io;bDFer7yn;a,cJkImas,nGta,ya;ki,o;helHki;ea,iannG7oI;da,n1L;an0bKemGgi0iJnIta,y0;a86ee;han81na;a,eI;cE5kaC;bi0chJe,i0mo0nIquEFy0;di,ia;aEDelIiB;!e,le;een4ia0;aOeNhLipaluk,oKrIute67;iIudenCL;scil3LyamvaB;lly,rt2;ilome0oebe,ylI;is,lis;ggy,nelope,r5t3;ige,m0UnLo5rvaDBtJulI;a,etAin1;ricIt4T;a,e,ia;do3i07;ctav2dJfCUis6lIphCUumBYyunbileg;a,ga,iv2;eIvA9;l2tA;aXeViNoJurIy5;!ay,ul;a,eKor,rJuI;f,r;aCeEma;ll1mi;aOcMhariBJkLlaKna,sIta,vi;anIha;ur;!y;a,iDNki;hoHk9SolI;a,eDE;!mh;hir,lIna,risFsreE;!a,lBO;asuMdLh2i6Cl5nKomi8rgEJtIzanin zah3;aIhal4;li1s6;cy,etA;e9iEP;nngu30;a0Ackenz4e02iNoKrignayani,uriD8yI;a,rI;a,lOna,tH;bi0i3llBDnI;a,iI;ca,ka,qCY;a,cUkaTlOmi,nMrJtzi,yI;ar;aJiam,lI;anEI;!l,nB;dy,eIh,n4;nhHrva;aLdKiCKlI;iIy;cent,e;red;!gros;!e5;ae5hI;ae5el40;ag5EgOi,lLrI;edi77iJjem,on,yI;em,l;em,sF;an4iIliF;nIsC9;a,da;!an,han;b0DcANd0Be,g09ha,i08ja,l06n04rMsoum5YtLuJv80x9FyIz4;bell,ra,soB4;de,rI;a,eE;h8Cild1t4;a,cYgUiLjor4l7Qn4s6tKwa,yI;!aIbe6Uja9lA9;m,nBC;a,ha,in1;!aKbC6eJja,lDna,sIt62;!a,ol,sa;!l1H;! Kh,mJnI;!a,e,n1;!awit,i;aliACcJeduarBfern5EjIlui5W;o6Dul2;ecil2la3;arKeJie,oIr46ueriA;!t;!ry;et44i39;el4Vi75y;dIon,ue5;akran7y;ak,en,iIlo3Q;a,ka,nB;a,re,s4te;daIg4;!l3C;alDd4elIge,isD6on0;ei9in1yn;el,le;a0Oe0DiZoRuMyI;d2la,nI;!a,dJeBCnIsCG;!a,eBB;a,sCE;aCRcKel0QiFlJna,pIz;e,i7;a,u,wa;iIy;a0Te,ja,l2LnB;is,l1TrKttJuIvel4;el5is1;e,ie;aLeJi8na,rI;a84i8;lIn1t7;ei;!in1;aTbb98dSepa,lNnKsJv2zI;!a,be5KetAz4;a,etA;!a,dI;a,sIy;ay,ey,i,y;a,iKja,lI;iIy;a9We;!aI;!nG;ia,ya;!nI;!a,ne;aQda,e0iOjZla,nNoLsKtIx4y5;iIt4;c2t2;e2NlCB;la,nIra;a,ie,o3;a,or1;a,gh,laI;!ni;!h,nI;a,d3e,n5O;cPdon93iOkes6mi96na,rNtKurJvIxmi,y5;ern1in2;a,e53ie,yn;as6iJoI;nya,ya;fa,s6;a,isF;a,la;ey,ie,y;a05e00hYiPlAFoOrKyI;lIra;a,ee,ie;istIy6B;a,en,iJyI;!na;!e,n58;nul,ri,urtnAV;aPerOlAUmKrIzzy;a,stI;en,in;!berlJmernI;aq;eIi,y;e,y;a,stE;!na,ra;aIei3ongordzol;dij1w5;el7MiLjsi,lKnJrI;a,i,ri;d3na,za;ey,i,lB8s4y;ra,s6;bi7cAEdiat7EeAXiSlRmQnyakuma1BrOss6HtLvi7yI;!e,lI;a,eI;e,i8H;a6BeJhIi4MlDri0y;ar69er69ie,leErAXy;!lyn8Cri0;a,en,iIl5Qoli0yn;!ma,nGsF;a5il1;ei8Ai,l4;a,tl6I;a09eZiWoOuI;anMdLliIst61;a8DeIsF;!n9tI;!a,te;e5Hi3Iy;a,i7;!anOcelDdNelHhan7NleMni,sJva0yI;a,ce;eIie;fIlDph5S;a,in1;en,n1;i8y;!a,e,n40;lIng;!i1DlI;!i1C;anOle0nLrKsI;i88sI;!e,i87;i,ri;!a,elHif2AnI;a,etAiIy;!e,f28;a,e89iJnI;a,e88iI;e,n1;cNda,mi,nJque4UsminGvie3y9zI;min8;a8eJiI;ce,e,n1s;!lIsFt0G;e,le;inJk4lDquelI;in1yn;da,ta;da,lSmQnPo0rOsJvaIzaro;!a0lu,na;aKiJlaIob7Z;!n9H;do3;belIdo3;!a,e,l37;a72en1i0ma;di3es,gr6Tji;a9elBogI;en1;a,e9iIo0se;a0na;aTePiKoIusFyacin29;da,ll4rten21snI;a,i9K;lJmaI;ri;aJdIlaJ;a,egard;ry;ath1AiKlJnriet7rmi9sI;sa,t19;en2Qga,mi;di;bi2Bil8ClOnNrKsJtIwa,yl8C;i5Nt4;n5Tti;iImo4Xri4Y;etI;!te;aCnaC;a,ey,l4;a03eXiSlQoOrLunKwI;enIyne1O;!dolD;ay,el;acieJetIiselB;a,chE;!la;ld19ogooI;sh;adys,enIor2yn2G;a,da,na;aLgi,lJna,ov84selIta;a,e,le;da,liI;an;!n0;mMnKorgJrI;ald3Ni,m3Atru86;etAi4S;a,eIna;s25vieve;ma;bJle,mIrnet,yH;al5Ji5;i5BrielI;a,l1;aUeRiQlorPoz2rI;anKeJiI;da,eB;da,ja;!cI;esJiIoi0N;n1s5X;!ca;a,enc2;en,o0;lJn0rnI;anB;ec2ic2;jr,n7rLtIy8;emJiIma,ouma7;ha,ma,n;eh;ah,iBrah,za0;cr4Ld0Oe0Ni0Mk7l05mXn4WrUsOtNuMvI;aKelJiI;!e,ta;inGyn;!ngel2S;geni1ni43;h5Qta;mMperanLtI;eJhIrel5;er;l2Zr8;za;a,eralB;iIma,nest2Jyn;cIka,n;a,ka;a,eNiKmI;aIie,y;!li9;lIn1;ee,iIy;a,e,ja;lIrald;da,y;aXeViOlNma,no3oLsKvI;a,iI;na,ra;a,ie;iIuiI;se;a,en,ie,y;a0c2da,f,nNsKzaI;!betIve7;e,h;aIe,ka;!beI;th;!a,or;anor,nG;!a;!in1na;leEs6;vi;eJiIna,wi0;e,th;l,n;aZeNh2iMjeneLoI;lor5Qminiq4Gn3DrItt4;a,eEis,la,othIthy;ea,y;ba;an0AnaCon9ya;anRbQde,ePiNlKmetr2nIsir5H;a,iI;ce,se;a,iJla,orIphi9;es,is;a,l6A;dIrdI;re;!d59na;!b2ForaCraC;a,d3nI;!a,e;hl2i0l0HmOnMphn1rJvi1WyI;le,na;a,by,cJia,lI;a,en1;ey,ie;a,etAiI;!ca,el1Bka,z;arIia;is;a0Se0Oh05i03lVoKristJynI;di,th2;al,i0;lQnNrJurI;tn1E;aKd2MiIn2Mri9;!nI;a,e,n1;!l4;cepci57n4sI;tanIuelo;ce,za;eIleE;en,tA;aKeoJotI;il4Z;!pat3;ir8rKudI;etAiI;a,ne;a,e,iI;ce,s00;a3er3ndI;i,y;aSeOloe,rI;isKyI;stI;al;sy,tI;a1Qen,iIy;an1e,n1;deKlseJrI;!i8yl;a,y;li9;nNrI;isLlJmI;ai9;a,eIotA;n1tA;!sa;d3elHtI;al,elH;cJlI;esAi42;el2ilI;e,ia,y;itlZlYmilXndWrOsMtIy5;aKeKhIri0;erIleErDy;in1;ri0;a32sI;a31ie;a,iOlMmeKolJrI;ie,ol;!e,in1yn;lIn;!a,la;a,eIie,o7y;ne,y;na,sF;a0Hi0H;a,e,l1;is7l4;in,yn;a0Ie02iZlXoUrI;andi8eRiKoJyI;an0nn;nwDoke;an3CdgMg0XtI;n2WtI;!aJnI;ey,i,y;ny;etI;!t8;an0e,nI;da,na;bbi8glarJlo06nI;i7n4;ka;ancIythe;a,he;an18lja0nIsm3I;i7tI;ou;aVcky,linUni7rQssPtKulaCvI;!erlI;ey,y;hKsy,tI;e,iIy8;e,na;!anI;ie,y;!ie;nIt6yl;adJiI;ce;etAi9;ay,da;!triI;ce,z;rbKyaI;rmI;aa;a3o3ra;a2Sb2Md23g1Zi1Qj5l16m0Xn0Aoi,r05sVtUuQvPwa,yJzI;ra,u0;aLes6gKlJseI;!l;in;un;!nI;a,na;a,i2I;drKgus1RrJsteI;ja;el2;a,ey,i,y;aahua,he0;hJi2Gja,mi7s2DtrI;id;aNlJraqIt21;at;eJi8yI;!n;e,iIy;gh;!nI;ti;iKleJo6pi7;ta;en,n1tA;aIelH;!n1J;a01dje5eZgViTjRnKohito,toIya;inetAnI;el5ia;!aLeJiImK;e,ka;!mItA;ar4;!belJliFmV;sa;!l1;a,eliI;ca;ka,sIta;a,sa;elIie;a,iI;a,ca,n1qI;ue;!tA;te;!bJmIstasiNya;ar2;el;aMberLeliKiIy;e,l2naI;!ta;a,ja;!ly;hHiJl2nB;da;a,ra;le;aXba,eQiNlLthKyI;a,c2sI;a,on,sa;ea;iIys0O;e,s0N;a,cJn1sIza;a,e,ha,on,sa;e,ia,ja;c2is6jaLksaLna,sKxI;aIia;!nd3;ia,saI;nd3;ra;ia;i0nJyI;ah,na;a,is,naCoud;la;c6da,leEmOnMsI;haClI;inIyZ;g,n;!h;a,o,slI;ey;ee;en;at6g4nJusI;ti0;es;ie;aXdiUelNrI;eKiI;anNenI;a,e,ne;an0;na;!aMeLiJyI;nn;a,n1;a,e;!ne;!iI;de;e,lDsI;on;yn;!lI;i9yn;ne;aLbJiIrM;!gaL;ey,i8y;!e;gaI;il;dLliyKradhJs6;ha;ya;ah;a,ya",
  "FirstName": "true\xA6aLblair,cHdevGgabrieFhinaEjCk9l8m4quinn,re3s0;h0umit;ay,e0iloh;a,lby;g6ne;a1el0ina,org5;!okuh9;naia,r0;ion,lo;ashawn,uca;asCe1ir0rE;an;lsAnyat2rry;am0ess6ie,ude;ie,m5;ta;le;an,on;as2h0;arl0eyenne;ie;ey,sidy;lex2ndr1ubr0;ey;a,ea;is",
  "Person": "true\xA6a0Ob0Hc08d05e02g01hZinez,jYkVlSmMnKoJpHr9s7t4v2w0xzibit,yanni;ar0ednesday adams,ill.i.am,oode;hol,rO;a0oltaiO;lentino rossi,n go7;a1heresa may,i0yra banks;ger woods,mbaQ;tum,ylor;a0carlett johanss03hakespeaJinbad,lobodan milosevic,ocratM;ddam hussain,ntigold;a6e5i4o2u0za;mi,n dmc,paul,sh limbau0;gh;d stewart,nald0thko;inho,o;hanYvaldo;ese witherspoVil9mbrandt;ffi,y roma03;a0e08ip07lato,oe,uff daddy;lm06ris hiltS;prah winfrWra;as,e0iles crane,ostradamP; yo,l3ttI;acklemo4essia3i1o0ubarek;by,lie3net,rrissS;randa ju0tt romnR;ly;en;re;ady gaga,e0iberaT;bron jam0e;es;anye west,e1iefer suther0obe bryant;land;ats,ndall,sha;aime,effersCk rowling;a0itlPulk hogan;lle berry,rrisA;ast9otye;ff1m0nya,zekiel;eril lagasse,inem;ie;a1e0ick wolf,rake;gas,nzel washingt4;lt3nB;ar5h3lint2o0;nfuci0olio;us;on;aucCy0;na;dinal wols1son0;! palm9;ey;a5e3o2ro0;ck,n0;te;no;ck,yon0;ce;nksy,rack obama;ristot1shton kutch0;er;le",
  "LastName": "true\xA60:9G;1:9W;2:9Y;3:9O;4:9I;5:8L;6:9L;7:A1;8:9F;9:8A;A:78;B:6G;C:6K;a9Vb8Nc7Ld6Ye6Tf6Fg5Wh59i55j4Qk45l3Nm2Sn2Fo27p1Oquispe,r18s0Ft05vVwOxNyGzD;aytsAEhD;aDou,u;ng,o;aGeun81iDoshiAAun;!lD;diDmaz;rim,z;maDng;da,guc98mo6VsDzaA;aAhiA8;iao,u;aHeGiEoDright,u;jc8Tng;lDmm0nkl0sniewsA;liA2s2;b0iss,lt0;a5Tgn0lDtanabe;k0sh;aHeGiEoDukB;lk5roby5;dBllalDnogr2Zr10ss0val37;ba,obos;lasEsel7P;lGn dFrg8FsEzD;qu7;ily9Pqu7silj9P;en b35ijk,yk;enzue96verde;aLeix1KhHi3j6ka3IoGrFsui,uD;om50rD;c3n0un1;an,embl8UynisA;dor96lst31m4rr9th;at5Ni7NoD;mErD;are70laci65;ps2s0Z;hirBkah8Enaka;a01chXeUhQiNmKoItFuEvDzabo;en8Bobod34;ar7bot4lliv3zuA;aEein0oD;i68j3Myan8W;l6rm0;kol5lovy5re6Rsa,to,uD;ng,sa;iDy60;rn5tD;!h;l5ZmEnDrbu;at8gh;mo6Eo6K;aFeDimizu;hu,vchD;en7Duk;la,r17;gu8infeld,mDoh,pulve8Trra4S;jDyD;on5;evi6Giltz,miDneid0roed0ulz,warz;dEtD;!z;!t;ar42h6ito,lFnDr4saAto,v4;ch7d0AtDz;a4Pe,os;as,ihBm3Zo0Q;aOeNiKoGuEyD;a67oo,u;bio,iz,sD;so,u;bEc7Bdrigue57g03j73mDosevelt,ssi,ta7Nux,w3Z;a4Ce0O;ertsDins2;!on;bei0LcEes,vDzzo;as,e8;ci,hards2;ag3es,it0ut0y9;dFmEnDsmu7Zv5F;tan1;ir7os;ic,u;aSeLhJiGoErDut6;asad,if60ochazk1V;lishc23pDrti63u55we67;e2Tov48;cEe09nD;as,to;as61hl0;aDillips;k,m,n5L;de3AetIna,rGtD;ersErovDtersC;!a,ic;en,on;eDic,ry,ss2;i8ra,tz,z;ers;h71k,rk0tEvD;ic,l3T;el,t2O;bJconnor,g2ClGnei5QrEzD;demir,turk;ella3MtDwe5O;ega,iz;iDof6GsC;vDyn1E;ei8;aPri1;aLeJguy1iFoDune44ym3;rodahl,vDwak;ak3Uik5otn57;eEkolDlsCx2;ic,ov6X;ls1miD;!n1;ils2mD;co42ec;gy,kaEray3varD;ro;jiDmu8shiD;ma;aWcUeQiPoIuD;lGnFrDssoli5T;atDpTr68;i,ov4;oz,te4C;d0l0;h3lInr13o0GrEsDza0Y;er,s;aFeEiDoz5r3Ete4C;!n6F;au,i8no,t4N;!l9;i2Rl0;crac5Ohhail5kke3Qll0;hmeFij0j2FlEn2Xrci0ssiDyer19;!er;n0Io;dBti;cartDlaughl6;hy;dMe6Egnu5Fi0jer35kLmJnci5ArFtEyD;er,r;ei,ic,su1O;iEkBqu9roqu6tinD;ez,s;a55c,nD;!o;a53mD;ad5;e5Pin1;rig4Ps1;aSeMiIoGuEyD;!nch;k4nDo;d,gu;mbarDpe2Svr4;di;!nDu,yana1T;coln,dD;bDholm;erg;bed5UfeGhtFitn0kaEn6rDw2H;oy;!j;in1on1;bvDvD;re;iDmmy,rsCu,voie;ne,t12;aTennedy,h3iSlQnez48oJrGuEvar3woD;k,n;cerDmar59znets5;a,o2H;aDem0i31yeziu;sni3RvD;ch3W;bay4Grh0Ksk0UvaFwalDzl5;czDsA;yk;cFlD;!cDen3S;huk;!ev4ic,s;e6uiveD;rt;eff0l4mu8nnun1;hn,llFminsArEstra33to,ur,yDzl5;a,s0;j0HlsC;oe;aMenLha2Qim0RoEuD;ng,r4;e2KhFnErge2Ku2OvD;anB;es,ss2;anEnsD;en,on,t2;nesDsC;en,s1;ki27s1;cGkob3RnsDrv06;en,sD;enDon;!s;ks2obs1;brahimBglesi3Ake4Ll0DnoZoneFshikEto,vanoD;u,v4A;awa;scu;aPeIitchcock,jaltal6oFrist46uD;!aDb0gh9ynh;m3ng;a24dz4fEjga2Tk,rDx3B;ak0Yvat;er,fm3B;iGmingw3NnErD;nand7re8;dDriks1;ers2;kkiEnD;on1;la,n1;dz4g1lvoLmJnsCqIrr0SsFuEyD;as36es;g1ng;anEhiD;mo0Q;i,ov08;ue;alaD;in1;rs1;aNeorgMheorghe,iKjonJoGrEuDw2;o,staf2Utierr7zm3;ayDg4iffitVub0;li1H;lub3Rme0JnEodD;e,m3;calv9zale0H;aj,i;bs2l,mDordaL;en7;iev3A;gnJlGmaFnd2Mo,rDs2Muthi0;cDza;ia;ge;eaElD;agh0i,o;no;e,on;ab0erLiHjeldsted,lor9oFriedm3uD;cDent9ji3E;hs;ntaDrt6urni0;na;lipEsD;ch0;ovD;!ic;hatBnanFrD;arDei8;a,i;deS;ov4;dGinste6riksCsDva0D;cob2YpDtra2W;inoza,osiL;en,s2;er,is2wards;aUeMiKjurhuJoHrisco0ZuEvorakD;!oQ;arte,boEmitru,rDt2U;and,ic;is;g3he0Imingu7n2Ord1AtD;to;us;aDmitr29ssanayake;s,z; GbnaFlEmirDrvis1Lvi,w3;!ov4;gado,ic;th;bo0groot,jo04lEsilDvri9;va;a cruz,e2uD;ca;hl,mcevsAnEt2EviD;d5es,s;ieDku1S;ls1;ki;a06e01hOiobNlarkMoFrD;ivDuz;elli;h1lHntGoFrDs26x;byn,reD;a,ia;ke,p0;i,rer0N;em3liD;ns;!e;anu;aLeIiu,oGriDuJwe;stD;eDiaD;ns1;i,ng,uFwDy;!dhury;!n,onEuD;ng;!g;kEnDpm3tterjee,v7;!d,g;ma,raboD;rty;bGl08ng4rD;eghetEnD;a,y;ti;an,ota0L;cer9lder2mpbeIrFstDvadi07;iDro;llo;doEt0uDvalho;so;so,zo;ll;es;a08eWhTiRlNoGrFyD;rne,tyD;qi;ank5iem,ooks,yant;gdan5nFruya,su,uchEyHziD;c,n5;ard;darDik;enD;ko;ov;aEondD;al;nco,zD;ev4;ancRshwD;as;a01oDuiy3;umDwmD;ik;ckNethov1gu,ktLnJrD;gGisFnD;ascoDds1;ni;ha;er,mD;ann;gtDit7nett;ss2;asD;hi;er,ham;b4ch,ez,hMiley,kk0nHrDu0;bEnDua;es,i0;ieDosa;ri;dDik;a8yopadhyD;ay;ra;er;k,ng;ic;cosZdYguilXkhtXlSnJrGsl3tchis2yD;aEd6;in;la;aEsl3;an;ujo,ya;dFgelD;ovD;!a;ersGov,reD;aDjL;ss1;en;en,on,s2;on;eksejGiyGmeiFvD;ar7es;ez;da;ev;ar;ams;ta",
  "Honorific": "true\xA6director1field marsh2lieutenant1rear0sergeant major,vice0; admir1; gener0;al",
  "Adj|Gerund": "true\xA60:3H;1:3J;2:33;3:2Z;4:37;5:35;6:3E;7:31;8:38;9:2J;a35b2Vc2Dd1Te1If17g11h0Yi0Rjud9l0Nm0Gnu0Fo0Ap04rYsKtEuBvAw18yiel3;ar6e08;nBpA;l1Rs0B;fol3n21sett2;aEeDhrBi4ouc7rAwis0;e0Bif2oub2us0yi1;ea1SiA;l2vi1;l2mp0rr1J;nt1Xxi1;aMcreec7enten2PhLkyrocke0lo1Tmi2oJpHtDuBweA;e1Sl2;pp2CrA;gi1pri5roun3;aBea8iAri2Jun25;mula0r4;gge4rA;t2vi1;ark2eAraw2;e3llb2H;aAot7;ki1ri1;i1Xoc2B;dYtisf6;aEeBive0oAus7;a4l2;assu4defi1Tfres7ig1Tjuve0QlaImai1Ts0vAwar3;ea2italiAol1I;si1zi1;gi1ll6mb2vi1;a6eDier25lun9rAun2E;eBoA;mi5vo21;ce3s5vai2;n3rpleA;xi1;ffCpWutBverAwi1;arc7lap12p0Pri3whel8;goi1l6st1L;en3sA;et0;m2Lrtu4;aEeDiCoBuAyst0L;mb2;t1Lvi1;s5tiga0;an1Tl0n3smeri28;dAtu4;de17;aCeaBiAo0W;fesa0Vmi0vi1;di1ni1;c1Hg9s0;llumiZmFnArri0T;cDfurGsCtBviA;go25ti1;e1Qimi23oxica0rig0X;pi4ul0;orpo22r0M;po5;arrowi1eaBorr03umilA;ia0;li1rtwar8;lErA;atiCip0BoBuelA;i1li1;undbrea13wi1;f6ng;a4ea8;aIetc7it0lEoCrBulfA;il2;ee1JighZust1P;rAun3;ebo3thco8;aCoA;a0wA;e4i1;mi1tte4;di1sciA;na0;lectrJmHnExA;aCci0hBis0pA;an3lo3;aOila1D;c0spe1C;ab2cBdu4ergi15ga9live06ric7s04tA;hral2i0L;han0oura9;barras5er9pA;owe4;if6;aSeIiBrA;if0;sAzz6;aEgDhearCsen0tA;rAur13;ac0es5;teU;us0;ppoin0r8;biliIcFfiRgra3ligh0mDpres5sCvA;asHeloA;pi1;erE;an3eaNorA;ali0L;a6eiBliLrA;ea5;vi1;ta0;ma9ri1s7un0zz2;aPhMlo5oAripp2ut0;mGnArrespon3;cerEfDspi4tAvinU;inBrA;as0ibu0ol2;ui1;lic0u5;ni1;fDmCpA;eAromi5;l2ti1;an3;or0;aAil2;llen9n9r8;gi1;l8ptAri1;iva0;aff2eGin3lFoDrBuA;d3st2;eathtaAui5;ki1;gg2i2o8ri1unA;ci1;in3;co8wiA;lAtc7;de4;bsorVcOgonMlJmHnno6ppea2rFsA;pi4su4toA;nBun3;di1;is7;hi1;res0;li1;aFu5;si1;ar8lu4;ri1;mi1;iAzi1;zi1;cAhi1;eleDomA;moBpan6;yi1;da0;ra0;ti1;bi1;ng",
  "Adverb": "true\xA6a08b05d00eYfSheQinPjustOkinda,likewiZmMnJoEpCquite,r9s5t2u0very,well;ltima01p0; to,wards5;h1iny bit,o0wiO;o,t6;en,us;eldom,o0uch;!me1rt0; of;how,times,w0C;a1e0;alS;ndomRth05;ar excellenEer0oint blank; Lhaps;f3n0utright;ce0ly;! 0;ag05moX; courGten;ewJo0; longWt 0;onHwithstand9;aybe,eanwhiNore0;!ovT;! aboX;deed,steY;lla,n0;ce;or3u0;ck1l9rther0;!moK;ing; 0evK;exampCgood,suH;n mas0vI;se;e0irect2; 2fini0;te0;ly;juAtrop;ackward,y 0;far,no0; means,w; GbroFd nauseam,gEl7ny5part,s4t 2w0;ay,hi0;le;be7l0mo7wor7;arge,ea6; soon,i4;mo0way;re;l 3mo2ongsi1ready,so,togeth0ways;er;de;st;b1t0;hat;ut;ain;ad;lot,posteriori",
  "Conjunction": "true\xA6aXbTcReNhowMiEjust00noBo9p8supposing,t5wh0yet;e1il0o3;e,st;n1re0thN; if,by,vM;evL;h0il,o;erefOo0;!uU;lus,rovided th9;r0therwiM;! not; mattEr,w0;! 0;since,th4w7;f4n0; 0asmuch;as mIcaForder t0;h0o;at;! 0;only,t0w0;hen;!ev3;ith2ven0;! 0;if,tB;er;o0uz;s,z;e0ut,y the time;cau1f0;ore;se;lt3nd,s 0;far1if,m0soon1t2;uch0; as;hou0;gh",
  "Currency": "true\xA6$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0\xA2,\xA3,\xA5,\u0434\u0435\u043D,\u043B\u0432,\u0440\u0443\u0431,\u0E3F,\u20A1,\u20A8,\u20AC,\u20AD,\uFDFC;lotyQ\u0142;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s",
  "Determiner": "true\xA6aBboth,d9e6few,le5mu8neiDplenty,s4th2various,wh0;at0ich0;evC;a0e4is,ose;!t;everal,ome;!ast,s;a1l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er",
  "Adj|Present": "true\xA6a07b04cVdQeNfJhollIidRlEmCnarrIoBp9qua8r7s3t2uttFw0;aKet,ro0;ng,u08;endChin;e2hort,l1mooth,our,pa9tray,u0;re,speU;i2ow;cu6da02leSpaN;eplica01i02;ck;aHerfePr0;eseUime,omV;bscu1pen,wn;atu0e3odeH;re;a2e1ive,ow0;er;an;st,y;ow;a2i1oul,r0;ee,inge;rm;iIke,ncy,st;l1mpty,x0;emHpress;abo4ic7;amp,e2i1oub0ry,ull;le;ffu9re6;fu8libe0;raE;alm,l5o0;mpleCn3ol,rr1unterfe0;it;e0u7;ct;juga8sum7;ea1o0;se;n,r;ankru1lu0;nt;pt;li2pproxi0rticula1;ma0;te;ght",
  "Comparable": "true\xA60:3C;1:3Q;2:3F;a3Tb3Cc33d2Ue2Nf2Ag1Wh1Li1Fj1Ek1Bl13m0Xn0So0Rp0Iqu0Gr07sHtCug0vAw4y3za0Q;el10ouN;ary,e6hi5i3ry;ck0Cde,l3n1ry,se;d,y;ny,te;a3i3R;k,ry;a3erda2ulgar;gue,in,st;a6en2Xhi5i4ouZr3;anqu2Den1ue;dy,g36me0ny;ck,rs29;ll,me,rt,wd3I;aRcaPeOhMiLkin0BlImGoEpDt6u4w3;eet,ift;b3dd0Wperfi21rre29;sta27t22;a8e7iff,r4u3;pUr1;a4ict,o3;ng;ig2Vn0N;a1ep,rn;le,rk,te0;e1Si2Vright0;ci1Zft,l3on,re;emn,id;a3el0;ll,rt;e4i3y;g2Mm0Z;ek,nd2T;ck24l0mp1M;a3iRrill,y;dy,l01rp;ve0Jxy;n1Kr3;ce,y;d,fe,int0l1Iv0V;a8e6i5o3ude;mantic,o19sy,u3;gh;pe,t1P;a3d,mo0A;dy,l;gg4iFndom,p3re,w;id;ed;ai2i3;ck,et;hoAink,l9o8r5u3;ny,r3;e,p12;egna2ic4o3;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e5i4o3u15;b0Tisy,rm0Zsy;bb0ce,mb0S;a3r1w;r,t;ad,e5ild,o4u3;nda12te;ist,o1;a4ek,l3;low;s0ty;a8e7i6o3ucky;f0Kn4o15u3ve0w10y0O;d,sy;e0g;ke0l,mp,tt0Fve0;e1Qwd;me,r3te;ge;e4i3;nd;en;ol0ui19;cy,ll,n3;secu6t3;e3ima4;llege2rmedia3;te;re;aAe7i6o5u3;ge,m3ng1C;bZid;me0t;gh,l0;a3fYsita2;dy,rXv3;en0y;nd13ppy,r3;d3sh;!y;aFenEhCiBlAoofy,r3;a8e6i5o3ue0Z;o3ss;vy;m,s0;at,e3y;dy,n;nd,y;ad,ib,ooD;a2d1;a3o3;st0;tEuiS;u1y;aDeebCi9l8o6r5u3;ll,n3r0N;!ny;aDesh,iend0;a3nd,rmE;my;at,ir8;erce4nan3;ciA;! ;le;r,ul3;ty;a6erie,sse4v3xtre0A;il;nti3;al;r4s3;tern,y;ly,th0;appYe8i4u3;mb;r5vi4z3;zy;ne;e,ty;a3ep,n9;d3f,r;!ly;agey,h8l7o5r4u3;dd0r0te;isp,uel;ar3ld,mmon,st0ward0zy;se;evKou1;e3il0;ap,e3;sy;aHiFlCoAr5u3;ff,r0sy;ly;a6i3oad;g4llia2;nt;ht;sh,ve;ld,un3;cy;a4o3ue;nd,o1;ck,nd;g,tt3;er;d,ld,w1;dy;bsu6ng5we3;so3;me;ry;rd",
  "Person|Adj": "true\xA6brown,du2earnest,frank,mi2r0sa1;a0ich,u1;ndy;sty",
  "Modal": "true\xA6c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld",
  "Verb": "true\xA6born,cannot,gonna,has,keep tabs,msg",
  "Person|Verb": "true\xA6b8ch7dr6foster,gra5ja9lan4ma2ni9ollie,p1rob,s0wade;pike,t5ue;at,eg,ier2;ck,r0;k,shal;ce;ce,nt;ew;ase,u1;iff,l1ob,u0;ck;aze,ossom",
  "Person|Place": "true\xA6a5darw6h3jordan,k2orlando,s0victo7;a0ydney;lvador,mara,ntiago;ent,obe;amil0ous0;ton;lexand1ust0;in;ria",
  "Person|Date": "true\xA6a2j0sep;an0une;!uary;p0ugust,v0;ril"
};
const BASE = 36;
const seq = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cache = seq.split("").reduce(function(h2, c2, i2) {
  h2[c2] = i2;
  return h2;
}, {});
const toAlphaCode = function(n2) {
  if (seq[n2] !== void 0) {
    return seq[n2];
  }
  let places2 = 1;
  let range = BASE;
  let s2 = "";
  for (; n2 >= range; n2 -= range, places2++, range *= BASE) {
  }
  while (places2--) {
    const d2 = n2 % BASE;
    s2 = String.fromCharCode((d2 < 10 ? 48 : 55) + d2) + s2;
    n2 = (n2 - d2) / BASE;
  }
  return s2;
};
const fromAlphaCode = function(s2) {
  if (cache[s2] !== void 0) {
    return cache[s2];
  }
  let n2 = 0;
  let places2 = 1;
  let range = BASE;
  let pow = 1;
  for (; places2 < s2.length; n2 += range, places2++, range *= BASE) {
  }
  for (let i2 = s2.length - 1; i2 >= 0; i2--, pow *= BASE) {
    let d2 = s2.charCodeAt(i2) - 48;
    if (d2 > 10) {
      d2 -= 7;
    }
    n2 += d2 * pow;
  }
  return n2;
};
var encoding = {
  toAlphaCode,
  fromAlphaCode
};
const symbols = function(t2) {
  const reSymbol = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
  for (let i2 = 0; i2 < t2.nodes.length; i2++) {
    const m2 = reSymbol.exec(t2.nodes[i2]);
    if (!m2) {
      t2.symCount = i2;
      break;
    }
    t2.syms[encoding.fromAlphaCode(m2[1])] = encoding.fromAlphaCode(m2[2]);
  }
  t2.nodes = t2.nodes.slice(t2.symCount, t2.nodes.length);
};
var parseSymbols = symbols;
const indexFromRef = function(trie, ref2, index2) {
  const dnode = encoding.fromAlphaCode(ref2);
  if (dnode < trie.symCount) {
    return trie.syms[dnode];
  }
  return index2 + dnode + 1 - trie.symCount;
};
const toArray$2 = function(trie) {
  const all2 = [];
  const crawl = (index2, pref) => {
    let node = trie.nodes[index2];
    if (node[0] === "!") {
      all2.push(pref);
      node = node.slice(1);
    }
    const matches2 = node.split(/([A-Z0-9,]+)/g);
    for (let i2 = 0; i2 < matches2.length; i2 += 2) {
      const str = matches2[i2];
      const ref2 = matches2[i2 + 1];
      if (!str) {
        continue;
      }
      const have = pref + str;
      if (ref2 === "," || ref2 === void 0) {
        all2.push(have);
        continue;
      }
      const newIndex = indexFromRef(trie, ref2, index2);
      crawl(newIndex, have);
    }
  };
  crawl(0, "");
  return all2;
};
const unpack$2 = function(str) {
  const trie = {
    nodes: str.split(";"),
    syms: [],
    symCount: 0
  };
  if (str.match(":")) {
    parseSymbols(trie);
  }
  return toArray$2(trie);
};
var traverse = unpack$2;
const unpack = function(str) {
  if (!str) {
    return {};
  }
  const obj = str.split("|").reduce((h2, s2) => {
    const arr = s2.split("\xA6");
    h2[arr[0]] = arr[1];
    return h2;
  }, {});
  const all2 = {};
  Object.keys(obj).forEach(function(cat) {
    const arr = traverse(obj[cat]);
    if (cat === "true") {
      cat = true;
    }
    for (let i2 = 0; i2 < arr.length; i2++) {
      const k2 = arr[i2];
      if (all2.hasOwnProperty(k2) === true) {
        if (Array.isArray(all2[k2]) === false) {
          all2[k2] = [all2[k2], cat];
        } else {
          all2[k2].push(cat);
        }
      } else {
        all2[k2] = cat;
      }
    }
  });
  return all2;
};
var unpack$1 = unpack;
const prp = ["Possessive", "Pronoun"];
let misc$6 = {
  "20th century fox": "Organization",
  "7 eleven": "Organization",
  "motel 6": "Organization",
  g8: "Organization",
  vh1: "Organization",
  "km2": "Unit",
  "m2": "Unit",
  "dm2": "Unit",
  "cm2": "Unit",
  "mm2": "Unit",
  "mile2": "Unit",
  "in2": "Unit",
  "yd2": "Unit",
  "ft2": "Unit",
  "m3": "Unit",
  "dm3": "Unit",
  "cm3": "Unit",
  "in3": "Unit",
  "ft3": "Unit",
  "yd3": "Unit",
  "at&t": "Organization",
  "black & decker": "Organization",
  "h & m": "Organization",
  "johnson & johnson": "Organization",
  "procter & gamble": "Organization",
  "ben & jerry's": "Organization",
  "&": "Conjunction",
  i: ["Pronoun", "Singular"],
  he: ["Pronoun", "Singular"],
  she: ["Pronoun", "Singular"],
  it: ["Pronoun", "Singular"],
  they: ["Pronoun", "Plural"],
  we: ["Pronoun", "Plural"],
  was: ["Copula", "PastTense"],
  is: ["Copula", "PresentTense"],
  are: ["Copula", "PresentTense"],
  am: ["Copula", "PresentTense"],
  were: ["Copula", "PastTense"],
  her: prp,
  his: prp,
  hers: prp,
  their: prp,
  theirs: prp,
  themselves: prp,
  your: prp,
  our: prp,
  ours: prp,
  my: prp,
  its: prp,
  vs: ["Conjunction", "Abbreviation"],
  if: ["Condition", "Preposition"],
  closer: "Comparative",
  closest: "Superlative",
  much: "Adverb",
  may: "Modal",
  babysat: "PastTense",
  blew: "PastTense",
  drank: "PastTense",
  drove: "PastTense",
  forgave: "PastTense",
  skiied: "PastTense",
  spilt: "PastTense",
  stung: "PastTense",
  swam: "PastTense",
  swung: "PastTense",
  guaranteed: "PastTense",
  shrunk: "PastTense",
  nears: "PresentTense",
  nearing: "Gerund",
  neared: "PastTense",
  no: ["Negative", "Expression"]
};
var misc$7 = misc$6;
var emoticons = [
  ":(",
  ":)",
  ":P",
  ":p",
  ":O",
  ";(",
  ";)",
  ";P",
  ";p",
  ";O",
  ":3",
  ":|",
  ":/",
  ":\\",
  ":$",
  ":*",
  ":@",
  ":-(",
  ":-)",
  ":-P",
  ":-p",
  ":-O",
  ":-3",
  ":-|",
  ":-/",
  ":-\\",
  ":-$",
  ":-*",
  ":-@",
  ":^(",
  ":^)",
  ":^P",
  ":^p",
  ":^O",
  ":^3",
  ":^|",
  ":^/",
  ":^\\",
  ":^$",
  ":^*",
  ":^@",
  "):",
  "(:",
  "$:",
  "*:",
  ")-:",
  "(-:",
  "$-:",
  "*-:",
  ")^:",
  "(^:",
  "$^:",
  "*^:",
  "<3",
  "</3",
  "<\\3",
  "=("
];
const suffixes$3 = {
  a: [
    [/(antenn|formul|nebul|vertebr|vit)a$/i, "$1ae"],
    [/ia$/i, "ia"]
  ],
  e: [
    [/(kn|l|w)ife$/i, "$1ives"],
    [/(hive)$/i, "$1s"],
    [/([m|l])ouse$/i, "$1ice"],
    [/([m|l])ice$/i, "$1ice"]
  ],
  f: [
    [/^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves"],
    [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves"]
  ],
  i: [[/(octop|vir)i$/i, "$1i"]],
  m: [[/([ti])um$/i, "$1a"]],
  n: [[/^(oxen)$/i, "$1"]],
  o: [[/(al|ad|at|er|et|ed)o$/i, "$1oes"]],
  s: [
    [/(ax|test)is$/i, "$1es"],
    [/(alias|status)$/i, "$1es"],
    [/sis$/i, "ses"],
    [/(bu)s$/i, "$1ses"],
    [/(sis)$/i, "ses"],
    [/^(?!talis|.*hu)(.*)man$/i, "$1men"],
    [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, "$1i"]
  ],
  x: [
    [/(matr|vert|ind|cort)(ix|ex)$/i, "$1ices"],
    [/^(ox)$/i, "$1en"]
  ],
  y: [[/([^aeiouy]|qu)y$/i, "$1ies"]],
  z: [[/(quiz)$/i, "$1zes"]]
};
var rules$2 = suffixes$3;
const addE = /([xsz]|ch|sh)$/;
const trySuffix = function(str) {
  let c2 = str[str.length - 1];
  if (rules$2.hasOwnProperty(c2) === true) {
    for (let i2 = 0; i2 < rules$2[c2].length; i2 += 1) {
      let reg = rules$2[c2][i2][0];
      if (reg.test(str) === true) {
        return str.replace(reg, rules$2[c2][i2][1]);
      }
    }
  }
  return null;
};
const pluralize = function(str = "", model2) {
  let { irregularPlurals: irregularPlurals2, uncountable: uncountable2 } = model2.two;
  if (uncountable2.hasOwnProperty(str)) {
    return str;
  }
  if (irregularPlurals2.hasOwnProperty(str)) {
    return irregularPlurals2[str];
  }
  let plural2 = trySuffix(str);
  if (plural2 !== null) {
    return plural2;
  }
  if (addE.test(str)) {
    return str + "es";
  }
  return str + "s";
};
var toPlural$1 = pluralize;
const hasSwitch = /\|/;
let lexicon = misc$7;
let switches$1 = {};
const tmpModel$1 = { two: { irregularPlurals, uncountable: {} } };
Object.keys(lexData).forEach((tag2) => {
  let wordsObj = unpack$1(lexData[tag2]);
  if (!hasSwitch.test(tag2)) {
    Object.keys(wordsObj).forEach((w) => {
      lexicon[w] = tag2;
    });
    return;
  }
  Object.keys(wordsObj).forEach((w) => {
    switches$1[w] = tag2;
    if (tag2 === "Noun|Verb") {
      let plural2 = toPlural$1(w, tmpModel$1);
      switches$1[plural2] = "Plural|Verb";
    }
  });
});
emoticons.forEach((str) => lexicon[str] = "Emoticon");
delete lexicon[""];
delete lexicon[null];
delete lexicon[" "];
const n = "Singular";
var noun$1 = {
  beforeTags: {
    Determiner: n,
    Possessive: n,
    Acronym: n,
    Noun: n,
    Adjective: n,
    PresentTense: n,
    Gerund: n,
    PastTense: n,
    Infinitive: n,
    Date: n,
    Ordinal: n,
    Demonym: n
  },
  afterTags: {
    Value: n,
    Modal: n,
    Copula: n,
    PresentTense: n,
    PastTense: n,
    Demonym: n,
    Actor: n
  },
  beforeWords: {
    the: n,
    with: n,
    without: n,
    of: n,
    for: n,
    any: n,
    all: n,
    on: n,
    cut: n,
    cuts: n,
    increase: n,
    decrease: n,
    raise: n,
    drop: n,
    save: n,
    saved: n,
    saves: n,
    make: n,
    makes: n,
    made: n,
    minus: n,
    plus: n,
    than: n,
    another: n,
    versus: n,
    neither: n,
    about: n,
    favorite: n,
    best: n,
    daily: n,
    weekly: n,
    linear: n,
    binary: n,
    mobile: n,
    lexical: n,
    technical: n,
    computer: n,
    scientific: n,
    security: n,
    government: n,
    popular: n,
    formal: n,
    no: n,
    more: n,
    one: n,
    let: n,
    her: n,
    his: n,
    their: n,
    our: n,
    us: n
  },
  afterWords: {
    of: n,
    system: n,
    aid: n,
    method: n,
    utility: n,
    tool: n,
    reform: n,
    therapy: n,
    philosophy: n,
    room: n,
    authority: n,
    says: n,
    said: n,
    wants: n,
    wanted: n,
    is: n,
    did: n,
    do: n,
    can: n,
    wise: n
  }
};
const v = "Infinitive";
var verb = {
  beforeTags: {
    Modal: v,
    Adverb: v,
    Negative: v,
    Plural: v
  },
  afterTags: {
    Determiner: v,
    Adverb: v,
    Possessive: v,
    Reflexive: v,
    Preposition: v,
    Cardinal: v,
    Comparative: v,
    Superlative: v
  },
  beforeWords: {
    i: v,
    we: v,
    you: v,
    they: v,
    to: v,
    please: v,
    will: v,
    have: v,
    had: v,
    would: v,
    could: v,
    should: v,
    do: v,
    did: v,
    does: v,
    can: v,
    must: v,
    us: v,
    me: v,
    let: v,
    even: v,
    when: v,
    help: v,
    he: v,
    she: v,
    it: v,
    being: v,
    bi: v,
    co: v,
    contra: v,
    de: v,
    inter: v,
    intra: v,
    mis: v,
    pre: v,
    out: v,
    counter: v,
    nobody: v,
    somebody: v,
    anybody: v,
    everybody: v
  },
  afterWords: {
    the: v,
    me: v,
    you: v,
    him: v,
    us: v,
    her: v,
    his: v,
    them: v,
    they: v,
    it: v,
    himself: v,
    herself: v,
    itself: v,
    myself: v,
    ourselves: v,
    themselves: v,
    something: v,
    anything: v,
    a: v,
    an: v,
    up: v,
    down: v,
    by: v,
    out: v,
    off: v,
    under: v,
    what: v,
    all: v,
    to: v,
    because: v,
    although: v,
    after: v,
    before: v,
    how: v,
    otherwise: v,
    together: v,
    though: v,
    into: v,
    yet: v,
    more: v,
    here: v,
    there: v,
    away: v
  }
};
const clue$7 = {
  beforeTags: Object.assign({}, verb.beforeTags, noun$1.beforeTags, {}),
  afterTags: Object.assign({}, verb.afterTags, noun$1.afterTags, {}),
  beforeWords: Object.assign({}, verb.beforeWords, noun$1.beforeWords, {}),
  afterWords: Object.assign({}, verb.afterWords, noun$1.afterWords, {})
};
var actorVerb = clue$7;
const jj = "Adjective";
var adj$1 = {
  beforeTags: {
    Determiner: jj,
    Possessive: jj,
    Hyphenated: jj
  },
  afterTags: {
    Adjective: jj
  },
  beforeWords: {
    seem: jj,
    seemed: jj,
    seems: jj,
    feel: jj,
    feels: jj,
    felt: jj,
    stay: jj,
    appear: jj,
    appears: jj,
    appeared: jj,
    also: jj,
    over: jj,
    under: jj,
    too: jj,
    it: jj,
    but: jj,
    still: jj,
    really: jj,
    quite: jj,
    well: jj,
    very: jj,
    how: jj,
    deeply: jj,
    hella: jj,
    profoundly: jj,
    extremely: jj,
    so: jj,
    badly: jj,
    mostly: jj,
    totally: jj,
    awfully: jj,
    rather: jj,
    nothing: jj,
    something: jj,
    anything: jj,
    not: jj,
    me: jj,
    is: jj
  },
  afterWords: {
    too: jj,
    also: jj,
    or: jj,
    enough: jj,
    about: jj
  }
};
const g = "Gerund";
var gerund = {
  beforeTags: {
    Adverb: g,
    Preposition: g,
    Conjunction: g
  },
  afterTags: {
    Adverb: g,
    Possessive: g,
    Person: g,
    Pronoun: g,
    Determiner: g,
    Copula: g,
    Preposition: g,
    Conjunction: g,
    Comparative: g
  },
  beforeWords: {
    been: g,
    keep: g,
    continue: g,
    stop: g,
    am: g,
    be: g,
    me: g,
    began: g,
    start: g,
    starts: g,
    started: g,
    stops: g,
    stopped: g,
    help: g,
    helps: g,
    avoid: g,
    avoids: g,
    love: g,
    loves: g,
    loved: g,
    hate: g,
    hates: g,
    hated: g
  },
  afterWords: {
    you: g,
    me: g,
    her: g,
    him: g,
    his: g,
    them: g,
    their: g,
    it: g,
    this: g,
    there: g,
    on: g,
    about: g,
    for: g,
    up: g,
    down: g
  }
};
const clue$6 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, gerund.beforeTags, {
    Imperative: "Gerund",
    Infinitive: "Adjective",
    PresentTense: "Gerund",
    Plural: "Gerund"
  }),
  afterTags: Object.assign({}, adj$1.afterTags, gerund.afterTags, {
    Singular: "Adjective"
  }),
  beforeWords: Object.assign({}, adj$1.beforeWords, gerund.beforeWords, {
    is: "Adjective",
    was: "Adjective",
    of: "Adjective",
    suggest: "Gerund",
    recommend: "Gerund"
  }),
  afterWords: Object.assign({}, adj$1.afterWords, gerund.afterWords, {
    to: "Gerund",
    not: "Gerund",
    the: "Gerund"
  })
};
var adjGerund$1 = clue$6;
const misc$5 = {
  beforeTags: {
    Determiner: void 0,
    Cardinal: "Noun",
    PhrasalVerb: "Adjective"
  },
  afterTags: {}
};
const clue$5 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, noun$1.beforeTags, misc$5.beforeTags),
  afterTags: Object.assign({}, adj$1.afterTags, noun$1.afterTags, misc$5.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, noun$1.beforeWords, {
    are: "Adjective",
    is: "Adjective",
    was: "Adjective",
    be: "Adjective",
    off: "Adjective",
    out: "Adjective"
  }),
  afterWords: Object.assign({}, adj$1.afterWords, noun$1.afterWords)
};
var adjNoun = clue$5;
let past$1 = "PastTense";
const adjPast = {
  beforeTags: {
    Adverb: past$1,
    Pronoun: past$1,
    ProperNoun: past$1,
    Auxiliary: past$1,
    Noun: past$1
  },
  afterTags: {
    Possessive: past$1,
    Pronoun: past$1,
    Determiner: past$1,
    Adverb: past$1,
    Comparative: past$1,
    Date: past$1,
    Gerund: past$1
  },
  beforeWords: {
    be: past$1,
    who: past$1,
    get: "Adjective",
    had: past$1,
    has: past$1,
    have: past$1,
    been: past$1,
    it: past$1,
    as: past$1,
    for: "Adjective",
    more: "Adjective"
  },
  afterWords: {
    by: past$1,
    back: past$1,
    out: past$1,
    in: past$1,
    up: past$1,
    down: past$1,
    before: past$1,
    after: past$1,
    for: past$1,
    the: past$1,
    with: past$1,
    as: past$1,
    on: past$1,
    at: past$1,
    between: past$1,
    to: past$1,
    into: past$1,
    us: past$1,
    them: past$1,
    his: past$1,
    her: past$1,
    their: past$1,
    our: past$1,
    me: past$1
  }
};
var adjPast$1 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, adjPast.beforeTags),
  afterTags: Object.assign({}, adj$1.afterTags, adjPast.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, adjPast.beforeWords),
  afterWords: Object.assign({}, adj$1.afterWords, adjPast.afterWords)
};
const misc$4 = {
  afterTags: {
    Noun: "Adjective",
    Conjunction: void 0
  }
};
const clue$4 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, verb.beforeTags, {
    Adverb: void 0,
    Negative: void 0
  }),
  afterTags: Object.assign({}, adj$1.afterTags, verb.afterTags, misc$4.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, verb.beforeWords, {
    have: void 0,
    had: void 0,
    not: void 0,
    went: "Adjective",
    goes: "Adjective",
    got: "Adjective",
    be: "Adjective"
  }),
  afterWords: Object.assign({}, adj$1.afterWords, verb.afterWords, {
    to: void 0,
    as: "Adjective"
  })
};
var adjPresent = clue$4;
const misc$3 = {
  beforeTags: {
    Copula: "Gerund",
    PastTense: "Gerund",
    PresentTense: "Gerund",
    Infinitive: "Gerund"
  },
  afterTags: {},
  beforeWords: {
    are: "Gerund",
    were: "Gerund",
    be: "Gerund",
    no: "Gerund",
    without: "Gerund",
    you: "Gerund",
    we: "Gerund",
    they: "Gerund",
    he: "Gerund",
    she: "Gerund",
    us: "Gerund",
    them: "Gerund"
  },
  afterWords: {
    the: "Gerund",
    this: "Gerund",
    that: "Gerund",
    me: "Gerund",
    us: "Gerund",
    them: "Gerund"
  }
};
const clue$3 = {
  beforeTags: Object.assign({}, gerund.beforeTags, noun$1.beforeTags, misc$3.beforeTags),
  afterTags: Object.assign({}, gerund.afterTags, noun$1.afterTags, misc$3.afterTags),
  beforeWords: Object.assign({}, gerund.beforeWords, noun$1.beforeWords, misc$3.beforeWords),
  afterWords: Object.assign({}, gerund.afterWords, noun$1.afterWords, misc$3.afterWords)
};
var nounGerund = clue$3;
const nn$1 = "Singular";
const vb$1 = "Infinitive";
const clue$2 = {
  beforeTags: Object.assign({}, verb.beforeTags, noun$1.beforeTags, {
    Adjective: nn$1,
    Particle: nn$1
  }),
  afterTags: Object.assign({}, verb.afterTags, noun$1.afterTags, {
    ProperNoun: vb$1,
    Gerund: vb$1,
    Adjective: vb$1,
    Copula: nn$1
  }),
  beforeWords: Object.assign({}, verb.beforeWords, noun$1.beforeWords, {
    is: nn$1,
    was: nn$1,
    of: nn$1,
    have: null
  }),
  afterWords: Object.assign({}, verb.afterWords, noun$1.afterWords, {
    instead: vb$1,
    about: vb$1,
    his: vb$1,
    her: vb$1,
    to: null,
    by: null,
    in: null
  })
};
var nounVerb = clue$2;
const p$2 = "Person";
var person$1 = {
  beforeTags: {
    Honorific: p$2,
    Person: p$2
  },
  afterTags: {
    Person: p$2,
    ProperNoun: p$2,
    Verb: p$2
  },
  ownTags: {
    ProperNoun: p$2
  },
  beforeWords: {
    hi: p$2,
    hey: p$2,
    yo: p$2,
    dear: p$2,
    hello: p$2
  },
  afterWords: {
    said: p$2,
    says: p$2,
    told: p$2,
    tells: p$2,
    feels: p$2,
    felt: p$2,
    seems: p$2,
    thinks: p$2,
    thought: p$2,
    spends: p$2,
    spendt: p$2,
    plays: p$2,
    played: p$2,
    sing: p$2,
    sang: p$2,
    learn: p$2,
    learned: p$2,
    wants: p$2,
    wanted: p$2
  }
};
const m$2 = "Month";
const p$1 = "Person";
const month = {
  beforeTags: {
    Date: m$2,
    Value: m$2
  },
  afterTags: {
    Date: m$2,
    Value: m$2
  },
  beforeWords: {
    by: m$2,
    in: m$2,
    on: m$2,
    during: m$2,
    after: m$2,
    before: m$2,
    between: m$2,
    until: m$2,
    til: m$2,
    sometime: m$2,
    of: m$2,
    this: m$2,
    next: m$2,
    last: m$2,
    previous: m$2,
    following: m$2,
    with: p$1
  },
  afterWords: {
    sometime: m$2,
    in: m$2,
    of: m$2,
    until: m$2,
    the: m$2
  }
};
var personDate = {
  beforeTags: Object.assign({}, person$1.beforeTags, month.beforeTags),
  afterTags: Object.assign({}, person$1.afterTags, month.afterTags),
  beforeWords: Object.assign({}, person$1.beforeWords, month.beforeWords),
  afterWords: Object.assign({}, person$1.afterWords, month.afterWords)
};
const clue$1 = {
  beforeTags: Object.assign({}, noun$1.beforeTags, person$1.beforeTags),
  afterTags: Object.assign({}, noun$1.afterTags, person$1.afterTags),
  beforeWords: Object.assign({}, noun$1.beforeWords, person$1.beforeWords, { i: "Infinitive", we: "Infinitive" }),
  afterWords: Object.assign({}, noun$1.afterWords, person$1.afterWords)
};
var personNoun = clue$1;
const clues$4 = {
  beforeTags: Object.assign({}, noun$1.beforeTags, person$1.beforeTags, verb.beforeTags),
  afterTags: Object.assign({}, noun$1.afterTags, person$1.afterTags, verb.afterTags),
  beforeWords: Object.assign({}, noun$1.beforeWords, person$1.beforeWords, verb.beforeWords),
  afterWords: Object.assign({}, noun$1.afterWords, person$1.afterWords, verb.afterWords)
};
var personVerb = clues$4;
const p = "Place";
const place = {
  beforeTags: {
    Place: p
  },
  afterTags: {
    Place: p,
    Abbreviation: p
  },
  beforeWords: {
    in: p,
    by: p,
    near: p,
    from: p,
    to: p
  },
  afterWords: {
    in: p,
    by: p,
    near: p,
    from: p,
    to: p,
    government: p,
    council: p,
    region: p,
    city: p
  }
};
const clue = {
  beforeTags: Object.assign({}, place.beforeTags, person$1.beforeTags),
  afterTags: Object.assign({}, place.afterTags, person$1.afterTags),
  beforeWords: Object.assign({}, place.beforeWords, person$1.beforeWords),
  afterWords: Object.assign({}, place.afterWords, person$1.afterWords)
};
var personPlace = clue;
const clues$3 = {
  beforeTags: Object.assign({}, person$1.beforeTags, adj$1.beforeTags),
  afterTags: Object.assign({}, person$1.afterTags, adj$1.afterTags),
  beforeWords: Object.assign({}, person$1.beforeWords, adj$1.beforeWords),
  afterWords: Object.assign({}, person$1.afterWords, adj$1.afterWords)
};
var personAdj = clues$3;
let un = "Unit";
const clues$2 = {
  beforeTags: { Value: un },
  afterTags: {},
  beforeWords: {
    per: un,
    every: un,
    each: un,
    square: un,
    cubic: un,
    sq: un,
    metric: un
  },
  afterWords: {
    per: un,
    squared: un,
    cubed: un,
    long: un
  }
};
var unitNoun = clues$2;
const clues = {
  "Actor|Verb": actorVerb,
  "Adj|Gerund": adjGerund$1,
  "Adj|Noun": adjNoun,
  "Adj|Past": adjPast$1,
  "Adj|Present": adjPresent,
  "Noun|Verb": nounVerb,
  "Noun|Gerund": nounGerund,
  "Person|Noun": personNoun,
  "Person|Date": personDate,
  "Person|Verb": personVerb,
  "Person|Place": personPlace,
  "Person|Adj": personAdj,
  "Unit|Noun": unitNoun
};
const copy = (obj, more) => {
  let res = Object.keys(obj).reduce((h2, k2) => {
    h2[k2] = obj[k2] === "Infinitive" ? "PresentTense" : "Plural";
    return h2;
  }, {});
  return Object.assign(res, more);
};
clues["Plural|Verb"] = {
  beforeWords: copy(clues["Noun|Verb"].beforeWords, {
    had: "Plural",
    have: "Plural"
  }),
  afterWords: copy(clues["Noun|Verb"].afterWords, {
    his: "PresentTense",
    her: "PresentTense",
    its: "PresentTense",
    in: null,
    to: null,
    is: "PresentTense",
    by: "PresentTense"
  }),
  beforeTags: copy(clues["Noun|Verb"].beforeTags, {
    Conjunction: "PresentTense",
    Noun: void 0,
    ProperNoun: "PresentTense"
  }),
  afterTags: copy(clues["Noun|Verb"].afterTags, {
    Gerund: "Plural",
    Noun: "PresentTense",
    Value: "PresentTense"
  })
};
var clues$1 = clues;
const Adj$2 = "Adjective";
const Inf$1 = "Infinitive";
const Pres$1 = "PresentTense";
const Sing$1 = "Singular";
const Past$1 = "PastTense";
const Avb = "Adverb";
const Plrl = "Plural";
const Actor$1 = "Actor";
const Vb = "Verb";
const Noun$2 = "Noun";
const Last$1 = "LastName";
const Modal = "Modal";
const Place = "Place";
const Prt = "Participle";
var suffixPatterns = [
  null,
  null,
  {
    ea: Sing$1,
    ia: Noun$2,
    ic: Adj$2,
    ly: Avb,
    "'n": Vb,
    "'t": Vb
  },
  {
    oed: Past$1,
    ued: Past$1,
    xed: Past$1,
    " so": Avb,
    "'ll": Modal,
    "'re": "Copula",
    azy: Adj$2,
    eer: Noun$2,
    end: Vb,
    ped: Past$1,
    ffy: Adj$2,
    ify: Inf$1,
    ing: "Gerund",
    ize: Inf$1,
    ibe: Inf$1,
    lar: Adj$2,
    mum: Adj$2,
    nes: Pres$1,
    nny: Adj$2,
    ous: Adj$2,
    que: Adj$2,
    ger: Noun$2,
    ber: Noun$2,
    rol: Sing$1,
    sis: Sing$1,
    ogy: Sing$1,
    oid: Sing$1,
    ian: Sing$1,
    zes: Pres$1,
    eld: Past$1,
    ken: Prt,
    ven: Prt,
    ten: Prt,
    ect: Inf$1,
    ict: Inf$1,
    ign: Inf$1,
    oze: Inf$1,
    ful: Adj$2,
    bal: Adj$2,
    ton: Noun$2
  },
  {
    amed: Past$1,
    aped: Past$1,
    ched: Past$1,
    lked: Past$1,
    rked: Past$1,
    reed: Past$1,
    nded: Past$1,
    mned: Adj$2,
    cted: Past$1,
    dged: Past$1,
    ield: Sing$1,
    akis: Last$1,
    cede: Inf$1,
    chuk: Last$1,
    czyk: Last$1,
    ects: Pres$1,
    iend: Sing$1,
    ends: Vb,
    enko: Last$1,
    ette: Sing$1,
    iary: Sing$1,
    wner: Sing$1,
    fies: Pres$1,
    fore: Avb,
    gate: Inf$1,
    gone: Adj$2,
    ices: Plrl,
    ints: Plrl,
    ruct: Inf$1,
    ines: Plrl,
    ions: Plrl,
    ners: Plrl,
    pers: Plrl,
    lers: Plrl,
    less: Adj$2,
    llen: Adj$2,
    made: Adj$2,
    nsen: Last$1,
    oses: Pres$1,
    ould: Modal,
    some: Adj$2,
    sson: Last$1,
    ians: Plrl,
    tion: Sing$1,
    tage: Noun$2,
    ique: Sing$1,
    tive: Adj$2,
    tors: Noun$2,
    vice: Sing$1,
    lier: Sing$1,
    fier: Sing$1,
    wned: Past$1,
    gent: Sing$1,
    tist: Actor$1,
    pist: Actor$1,
    rist: Actor$1,
    mist: Actor$1,
    yist: Actor$1,
    vist: Actor$1,
    ists: Actor$1,
    lite: Sing$1,
    site: Sing$1,
    rite: Sing$1,
    mite: Sing$1,
    bite: Sing$1,
    mate: Sing$1,
    date: Sing$1,
    ndal: Sing$1,
    vent: Sing$1,
    uist: Actor$1,
    gist: Actor$1,
    note: Sing$1,
    cide: Sing$1,
    ence: Sing$1,
    wide: Adj$2,
    vide: Inf$1,
    ract: Inf$1,
    duce: Inf$1,
    pose: Inf$1,
    eive: Inf$1,
    lyze: Inf$1,
    lyse: Inf$1,
    iant: Adj$2,
    nary: Adj$2,
    ghty: Adj$2,
    uent: Adj$2,
    erer: Actor$1,
    bury: Place,
    dorf: Noun$2,
    esty: Noun$2,
    wych: Place,
    dale: Place,
    folk: Place
  },
  {
    elist: Actor$1,
    holic: Sing$1,
    phite: Sing$1,
    tized: Past$1,
    urned: Past$1,
    eased: Past$1,
    ances: Plrl,
    bound: Adj$2,
    ettes: Plrl,
    fully: Avb,
    ishes: Pres$1,
    ities: Plrl,
    marek: Last$1,
    nssen: Last$1,
    ology: Noun$2,
    osome: Sing$1,
    tment: Sing$1,
    ports: Plrl,
    rough: Adj$2,
    tches: Pres$1,
    tieth: "Ordinal",
    tures: Plrl,
    wards: Avb,
    where: Avb,
    archy: Noun$2,
    pathy: Noun$2,
    opoly: Noun$2,
    embly: Noun$2,
    phate: Noun$2,
    ndent: Sing$1,
    scent: Sing$1,
    onist: Actor$1,
    anist: Actor$1,
    alist: Actor$1,
    olist: Actor$1,
    icist: Actor$1,
    ounce: Inf$1,
    iable: Adj$2,
    borne: Adj$2,
    gnant: Adj$2,
    inant: Adj$2,
    igent: Adj$2,
    atory: Adj$2,
    rient: Sing$1,
    dient: Sing$1,
    maker: Actor$1,
    burgh: Place,
    mouth: Place,
    ceter: Place,
    ville: Place,
    worth: Noun$2
  },
  {
    auskas: Last$1,
    parent: Sing$1,
    cedent: Sing$1,
    ionary: Sing$1,
    cklist: Sing$1,
    keeper: Actor$1,
    logist: Actor$1,
    teenth: "Value",
    worker: Actor$1,
    master: Actor$1,
    writer: Actor$1,
    brough: Place,
    cester: Place
  },
  {
    logists: Actor$1,
    opoulos: Last$1,
    borough: Place,
    sdottir: Last$1
  }
];
const Adj$1 = "Adjective";
const Noun$1 = "Noun";
const Verb$1 = "Verb";
var prefixPatterns = [
  null,
  null,
  {},
  {
    neo: Noun$1,
    bio: Noun$1,
    "de-": Verb$1,
    "re-": Verb$1,
    "un-": Verb$1,
    "ex-": Noun$1
  },
  {
    anti: Noun$1,
    auto: Noun$1,
    faux: Adj$1,
    hexa: Noun$1,
    kilo: Noun$1,
    mono: Noun$1,
    nano: Noun$1,
    octa: Noun$1,
    poly: Noun$1,
    semi: Adj$1,
    tele: Noun$1,
    "pro-": Adj$1,
    "mis-": Verb$1,
    "dis-": Verb$1,
    "pre-": Adj$1
  },
  {
    anglo: Noun$1,
    centi: Noun$1,
    ethno: Noun$1,
    ferro: Noun$1,
    grand: Noun$1,
    hepta: Noun$1,
    hydro: Noun$1,
    intro: Noun$1,
    macro: Noun$1,
    micro: Noun$1,
    milli: Noun$1,
    nitro: Noun$1,
    penta: Noun$1,
    quasi: Adj$1,
    radio: Noun$1,
    tetra: Noun$1,
    "omni-": Adj$1,
    "post-": Adj$1
  },
  {
    pseudo: Adj$1,
    "extra-": Adj$1,
    "hyper-": Adj$1,
    "inter-": Adj$1,
    "intra-": Adj$1,
    "deca-": Adj$1
  },
  {
    electro: Noun$1
  }
];
const Adj = "Adjective";
const Inf = "Infinitive";
const Pres = "PresentTense";
const Sing = "Singular";
const Past = "PastTense";
const Adverb = "Adverb";
const Exp = "Expression";
const Actor = "Actor";
const Verb = "Verb";
const Noun = "Noun";
const Last = "LastName";
var endsWith = {
  a: [
    [/.[aeiou]na$/, Noun, "tuna"],
    [/.[oau][wvl]ska$/, Last],
    [/.[^aeiou]ica$/, Sing, "harmonica"],
    [/^([hyj]a+)+$/, Exp, "haha"]
  ],
  c: [[/.[^aeiou]ic$/, Adj]],
  d: [
    [/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, Past, "popped"],
    [/.[aeo]{2}[bdgmnprvz]ed$/, Past, "rammed"],
    [/.[aeiou][sg]hed$/, Past, "gushed"],
    [/.[aeiou]red$/, Past, "hired"],
    [/.[aeiou]r?ried$/, Past, "hurried"],
    [/[^aeiou]ard$/, Sing, "steward"],
    [/[aeiou][^aeiou]id$/, Adj, ""],
    [/.[vrl]id$/, Adj, "livid"],
    [/..led$/, Past, "hurled"],
    [/.[iao]sed$/, Past, ""],
    [/[aeiou]n?[cs]ed$/, Past, ""],
    [/[aeiou][rl]?[mnf]ed$/, Past, ""],
    [/[aeiou][ns]?c?ked$/, Past, "bunked"],
    [/[aeiou]gned$/, Past],
    [/[aeiou][nl]?ged$/, Past],
    [/.[tdbwxyz]ed$/, Past],
    [/[^aeiou][aeiou][tvx]ed$/, Past],
    [/.[cdflmnprstv]ied$/, Past, "emptied"]
  ],
  e: [
    [/.[lnr]ize$/, Inf, "antagonize"],
    [/.[^aeiou]ise$/, Inf, "antagonise"],
    [/.[aeiou]te$/, Inf, "bite"],
    [/.[^aeiou][ai]ble$/, Adj, "fixable"],
    [/.[^aeiou]eable$/, Adj, "maleable"],
    [/.[ts]ive$/, Adj, "festive"],
    [/[a-z]-like$/, Adj, "woman-like"]
  ],
  h: [
    [/.[^aeiouf]ish$/, Adj, "cornish"],
    [/.v[iy]ch$/, Last, "..ovich"],
    [/^ug?h+$/, Exp, "ughh"],
    [/^uh[ -]?oh$/, Exp, "uhoh"],
    [/[a-z]-ish$/, Adj, "cartoon-ish"]
  ],
  i: [[/.[oau][wvl]ski$/, Last, "polish-male"]],
  k: [
    [/^(k){2}$/, Exp, "kkkk"]
  ],
  l: [
    [/.[gl]ial$/, Adj, "familial"],
    [/.[^aeiou]ful$/, Adj, "fitful"],
    [/.[nrtumcd]al$/, Adj, "natal"],
    [/.[^aeiou][ei]al$/, Adj, "familial"]
  ],
  m: [
    [/.[^aeiou]ium$/, Sing, "magnesium"],
    [/[^aeiou]ism$/, Sing, "schism"],
    [/^[hu]m+$/, Exp, "hmm"],
    [/^\d+ ?[ap]m$/, "Date", "3am"]
  ],
  n: [
    [/.[lsrnpb]ian$/, Adj, "republican"],
    [/[^aeiou]ician$/, Actor, "musician"],
    [/[aeiou][ktrp]in'$/, "Gerund", "cookin'"]
  ],
  o: [
    [/^no+$/, Exp, "noooo"],
    [/^(yo)+$/, Exp, "yoo"],
    [/^wo{2,}[pt]?$/, Exp, "woop"]
  ],
  r: [
    [/.[bdfklmst]ler$/, "Noun"],
    [/[aeiou][pns]er$/, Sing],
    [/[^i]fer$/, Inf],
    [/.[^aeiou][ao]pher$/, Actor],
    [/.[lk]er$/, "Noun"],
    [/.ier$/, "Comparative"]
  ],
  t: [
    [/.[di]est$/, "Superlative"],
    [/.[icldtgrv]ent$/, Adj],
    [/[aeiou].*ist$/, Adj],
    [/^[a-z]et$/, Verb]
  ],
  s: [
    [/.[^aeiou]ises$/, Pres],
    [/.[rln]ates$/, Pres],
    [/.[^z]ens$/, Verb],
    [/.[lstrn]us$/, Sing],
    [/.[aeiou]sks$/, Pres],
    [/.[aeiou]kes$/, Pres],
    [/[aeiou][^aeiou]is$/, Sing],
    [/[a-z]'s$/, Noun],
    [/^yes+$/, Exp]
  ],
  v: [
    [/.[^aeiou][ai][kln]ov$/, Last]
  ],
  y: [
    [/.[cts]hy$/, Adj],
    [/.[st]ty$/, Adj],
    [/.[tnl]ary$/, Adj],
    [/.[oe]ry$/, Sing],
    [/[rdntkbhs]ly$/, Adverb],
    [/.(gg|bb|zz)ly$/, Adj],
    [/...lly$/, Adverb],
    [/.[gk]y$/, Adj],
    [/[bszmp]{2}y$/, Adj],
    [/.[ai]my$/, Adj],
    [/[ea]{2}zy$/, Adj],
    [/.[^aeiou]ity$/, Sing]
  ]
};
const vb = "Verb";
const nn = "Noun";
var neighbours$2 = {
  leftTags: [
    ["Adjective", nn],
    ["Possessive", nn],
    ["Determiner", nn],
    ["Adverb", vb],
    ["Pronoun", vb],
    ["Value", nn],
    ["Ordinal", nn],
    ["Modal", vb],
    ["Superlative", nn],
    ["Demonym", nn],
    ["Honorific", "Person"]
  ],
  leftWords: [
    ["i", vb],
    ["first", nn],
    ["it", vb],
    ["there", vb],
    ["not", vb],
    ["because", nn],
    ["if", nn],
    ["but", nn],
    ["who", vb],
    ["this", nn],
    ["his", nn],
    ["when", nn],
    ["you", vb],
    ["very", "Adjective"],
    ["old", nn],
    ["never", vb],
    ["before", nn],
    ["a", nn],
    ["the", nn],
    ["been", vb]
  ],
  rightTags: [
    ["Copula", nn],
    ["PastTense", nn],
    ["Conjunction", nn],
    ["Modal", nn]
  ],
  rightWords: [
    ["there", vb],
    ["me", vb],
    ["man", "Adjective"],
    ["him", vb],
    ["it", vb],
    ["were", nn],
    ["took", nn],
    ["himself", vb],
    ["went", nn],
    ["who", nn],
    ["jr", "Person"]
  ]
};
var data = {
  "Comparative": {
    "fwd": "3:ser,ier\xA61er:h,t,f,l,n\xA61r:e\xA62er:ss,or,om",
    "both": "3er:ver,ear,alm\xA63ner:hin\xA63ter:lat\xA62mer:im\xA62er:ng,rm,mb\xA62ber:ib\xA62ger:ig\xA61er:w,p,k,d\xA6ier:y",
    "rev": "1:tter,yer\xA62:uer,ver,ffer,oner,eler,ller,iler,ster,cer,uler,sher,ener,gher,aner,adder,nter,eter,rter,hter,rner,fter\xA63:oser,ooler,eafer,user,airer,bler,maler,tler,eater,uger,rger,ainer,urer,ealer,icher,pler,emner,icter,nser,iser\xA64:arser,viner,ucher,rosser,somer,ndomer,moter,oother,uarer,hiter\xA65:nuiner,esser,emier\xA6ar:urther",
    "ex": "worse:bad\xA6better:good\xA64er:fair,gray,poor\xA61urther:far\xA63ter:fat,hot,wet\xA63er:lay,shy,fun\xA63der:mad,sad\xA64der:glad\xA6:\xA64r:cute,dire,fake,fine,free,lame,late,pale,rare,ripe,rude,safe,sore,tame,wide\xA65r:eerie,stale"
  },
  "Gerund": {
    "fwd": "1:nning,tting,rring,pping,eing,mming,gging,dding,bbing,kking\xA62:eking,oling,eling,eming\xA63:velling,siting,uiting,fiting,loting,geting,ialing,celling\xA64:graming",
    "both": "1:aing,iing,fing,xing,ying,oing,hing,wing\xA62:tzing,rping,izzing,bting,mning,sping,wling,rling,wding,rbing,uping,lming,wning,mping,oning,lting,mbing,lking,fting,hting,sking,gning,pting,cking,ening,nking,iling,eping,ering,rting,rming,cting,lping,ssing,nting,nding,lding,sting,rning,rding,rking\xA63:belling,siping,toming,yaking,uaking,oaning,auling,ooping,aiding,naping,euring,tolling,uzzing,ganing,haning,ualing,halling,iasing,auding,ieting,ceting,ouling,voring,ralling,garing,joring,oaming,oaking,roring,nelling,ooring,uelling,eaming,ooding,eaping,eeting,ooting,ooming,xiting,keting,ooking,ulling,airing,oaring,biting,outing,oiting,earing,naling,oading,eeding,ouring,eaking,aiming,illing,oining,eaning,onging,ealing,aining,eading\xA64:thoming,melling,aboring,ivoting,weating,dfilling,onoring,eriting,imiting,tialling,rgining,otoring,linging,winging,lleting,louding,spelling,mpelling,heating,feating,opelling,choring,welling,ymaking,ctoring,calling,peating,iloring,laiting,utoring,uditing,mmaking,loating,iciting,waiting,mbating,voiding,otalling,nsoring,nselling,ocusing,itoring,eloping\xA65:rselling,umpeting,atrolling,treating,tselling,rpreting,pringing,ummeting,ossoming,elmaking,eselling,rediting,totyping,onmaking,rfeiting,ntrolling\xA65e:chmaking,dkeeping,severing,erouting,ecreting,ephoning,uthoring,ravening,reathing,pediting,erfering,eotyping,fringing,entoring,ombining,ompeting\xA64e:emaking,eething,twining,rruling,chuting,xciting,rseding,scoping,edoring,pinging,lunging,agining,craping,pleting,eleting,nciting,nfining,ncoding,tponing,ecoding,writing,esaling,nvening,gnoring,evoting,mpeding,rvening,dhering,mpiling,storing,nviting,ploring\xA63e:tining,nuring,saking,miring,haling,ceding,xuding,rining,nuting,laring,caring,miling,riding,hoking,piring,lading,curing,uading,noting,taping,futing,paring,hading,loding,siring,guring,vading,voking,during,niting,laning,caping,luting,muting,ruding,ciding,juring,laming,caling,hining,uoting,liding,ciling,duling,tuting,puting,cuting,coring,uiding,tiring,turing,siding,rading,enging,haping,buting,lining,taking,anging,haring,uiring,coming,mining,moting,suring,viding,luding\xA62e:tring,zling,uging,oging,gling,iging,vring,fling,lging,obing,psing,pling,ubing,cling,dling,wsing,iking,rsing,dging,kling,ysing,tling,rging,eging,nsing,uning,osing,uming,using,ibing,bling,aging,ising,asing,ating\xA62ie:rlying\xA61e:zing,uing,cing,ving",
    "rev": "ying:ie\xA61ing:se,ke,te,we,ne,re,de,pe,me,le,c,he\xA62ing:ll,ng,dd,ee,ye,oe,rg,us\xA62ning:un\xA62ging:og,ag,ug,ig,eg\xA62ming:um\xA62bing:ub,ab,eb,ob\xA63ning:lan,can,hin,pin,win\xA63ring:cur,lur,tir,tar,pur,car\xA63ing:ait,del,eel,fin,eat,oat,eem,lel,ool,ein,uin\xA63ping:rop,rap,top,uip,wap,hip,hop,lap,rip,cap\xA63ming:tem,wim,rim,kim,lim\xA63ting:mat,cut,pot,lit,lot,hat,set,pit,put\xA63ding:hed,bed,bid\xA63king:rek\xA63ling:cil,pel\xA63bing:rib\xA64ning:egin\xA64ing:isit,ruit,ilot,nsit,dget,rkel,ival,rcel\xA64ring:efer,nfer\xA64ting:rmit,mmit,ysit,dmit,emit,bmit,tfit,gret\xA64ling:evel,xcel,ivel\xA64ding:hred\xA65ing:arget,posit,rofit\xA65ring:nsfer\xA65ting:nsmit,orget,cquit\xA65ling:ancel,istil",
    "ex": "3:adding,eating,aiming,aiding,airing,outing,gassing,setting,getting,putting,cutting,winning,sitting,betting,mapping,tapping,letting,bidding,hitting,tanning,netting,popping,fitting,capping,lapping,barring,banning,vetting,topping,rotting,tipping,potting,wetting,pitting,dipping,budding,hemming,pinning,jetting,kidding,padding,podding,sipping,wedding,bedding,donning,warring,penning,gutting,cueing,wadding,petting,ripping,napping,matting,tinning,binning,dimming,hopping,mopping,nodding,panning,rapping,ridding,sinning\xA64:selling,falling,calling,waiting,editing,telling,rolling,heating,boating,hanging,beating,coating,singing,tolling,felling,polling,discing,seating,voiding,gelling,yelling,baiting,reining,ruining,seeking,spanning,stepping,knitting,emitting,slipping,quitting,dialing,omitting,clipping,shutting,skinning,abutting,flipping,trotting,cramming,fretting,suiting\xA65:bringing,treating,spelling,stalling,trolling,expelling,rivaling,wringing,deterring,singeing,befitting,refitting\xA66:enrolling,distilling,scrolling,strolling,caucusing,travelling\xA67:installing,redefining,stencilling,recharging,overeating,benefiting,unraveling,programing\xA69:reprogramming\xA6is:being\xA62e:using,aging,owing\xA63e:making,taking,coming,noting,hiring,filing,coding,citing,doping,baking,coping,hoping,lading,caring,naming,voting,riding,mining,curing,lining,ruling,typing,boring,dining,firing,hiding,piling,taping,waning,baling,boning,faring,honing,wiping,luring,timing,wading,piping,fading,biting,zoning,daring,waking,gaming,raking,ceding,tiring,coking,wining,joking,paring,gaping,poking,pining,coring,liming,toting,roping,wiring,aching\xA64e:writing,storing,eroding,framing,smoking,tasting,wasting,phoning,shaking,abiding,braking,flaking,pasting,priming,shoring,sloping,withing,hinging\xA65e:defining,refining,renaming,swathing,fringing,reciting\xA61ie:dying,tying,lying,vying\xA67e:sunbathing"
  },
  "Participle": {
    "fwd": "1:mt\xA62:llen\xA63:iven,aken\xA6:ne\xA6y:in",
    "both": "1:wn\xA62:me,aten\xA63:seen,bidden,isen\xA64:roven,asten\xA63l:pilt\xA63d:uilt\xA62e:itten\xA61im:wum\xA61eak:poken\xA61ine:hone\xA61ose:osen\xA61in:gun\xA61ake:woken\xA6ear:orn\xA6eal:olen\xA6eeze:ozen\xA6et:otten\xA6ink:unk\xA6ing:ung",
    "rev": "2:un\xA6oken:eak\xA6ought:eek\xA6oven:eave\xA61ne:o\xA61own:ly\xA61den:de\xA61in:ay\xA62t:am\xA62n:ee\xA63en:all\xA64n:rive,sake,take\xA65n:rgive",
    "ex": "2:been\xA63:seen,run\xA64:given,taken\xA65:shaken\xA62eak:broken\xA61ive:dove\xA62y:flown\xA63e:hidden,ridden\xA61eek:sought\xA61ake:woken\xA61eave:woven"
  },
  "PastTense": {
    "fwd": "1:tted,wed,gged,nned,een,rred,pped,yed,bbed,oed,dded,rd,wn,mmed\xA62:eed,nded,et,hted,st,oled,ut,emed,eled,lded,ken,rt,nked,apt,ant,eped,eked\xA63:eared,eat,eaded,nelled,ealt,eeded,ooted,eaked,eaned,eeted,mited,bid,uit,ead,uited,ealed,geted,velled,ialed,belled\xA64:ebuted,hined,comed\xA6y:ied\xA6ome:ame\xA6ear:ore\xA6ind:ound\xA6ing:ung,ang\xA6ep:pt\xA6ink:ank,unk\xA6ig:ug\xA6all:ell\xA6ee:aw\xA6ive:ave\xA6eeze:oze\xA6old:eld\xA6ave:ft\xA6ake:ook\xA6ell:old\xA6ite:ote\xA6ide:ode\xA6ine:one\xA6in:un,on\xA6eal:ole\xA6im:am\xA6ie:ay\xA6and:ood\xA61ise:rose\xA61eak:roke\xA61ing:rought\xA61ive:rove\xA61el:elt\xA61id:bade\xA61et:got\xA61y:aid\xA61it:sat\xA63e:lid\xA63d:pent",
    "both": "1:aed,fed,xed,hed\xA62:sged,xted,wled,rped,lked,kied,lmed,lped,uped,bted,rbed,rked,wned,rled,mped,fted,mned,mbed,zzed,omed,ened,cked,gned,lted,sked,ued,zed,nted,ered,rted,rmed,ced,sted,rned,ssed,rded,pted,ved,cted\xA63:cled,eined,siped,ooned,uked,ymed,jored,ouded,ioted,oaned,lged,asped,iged,mured,oided,eiled,yped,taled,moned,yled,lit,kled,oaked,gled,naled,fled,uined,oared,valled,koned,soned,aided,obed,ibed,meted,nicked,rored,micked,keted,vred,ooped,oaded,rited,aired,auled,filled,ouled,ooded,ceted,tolled,oited,bited,aped,tled,vored,dled,eamed,nsed,rsed,sited,owded,pled,sored,rged,osed,pelled,oured,psed,oated,loned,aimed,illed,eured,tred,ioned,celled,bled,wsed,ooked,oiled,itzed,iked,iased,onged,ased,ailed,uned,umed,ained,auded,nulled,ysed,eged,ised,aged,oined,ated,used,dged,doned\xA64:ntied,efited,uaked,caded,fired,roped,halled,roked,himed,culed,tared,lared,tuted,uared,routed,pited,naked,miled,houted,helled,hared,cored,caled,tired,peated,futed,ciled,called,tined,moted,filed,sided,poned,iloted,honed,lleted,huted,ruled,cured,named,preted,vaded,sured,talled,haled,peded,gined,nited,uided,ramed,feited,laked,gured,ctored,unged,pired,cuted,voked,eloped,ralled,rined,coded,icited,vided,uaded,voted,mined,sired,noted,lined,nselled,luted,jured,fided,puted,piled,pared,olored,cided,hoked,enged,tured,geoned,cotted,lamed,uiled,waited,udited,anged,luded,mired,uired,raded\xA65:modelled,izzled,eleted,umpeted,ailored,rseded,treated,eduled,ecited,rammed,eceded,atrolled,nitored,basted,twined,itialled,ncited,gnored,ploded,xcited,nrolled,namelled,plored,efeated,redited,ntrolled,nfined,pleted,llided,lcined,eathed,ibuted,lloted,dhered,cceded\xA63ad:sled\xA62aw:drew\xA62ot:hot\xA62ke:made\xA62ow:hrew,grew\xA62ose:hose\xA62d:ilt\xA62in:egan\xA61un:ran\xA61ink:hought\xA61ick:tuck\xA61ike:ruck\xA61eak:poke,nuck\xA61it:pat\xA61o:did\xA61ow:new\xA61ake:woke\xA6go:went",
    "rev": "3:rst,hed,hut,cut,set\xA64:tbid\xA65:dcast,eread,pread,erbid\xA6ought:uy,eek\xA61ied:ny,ly,dy,ry,fy,py,vy,by,ty,cy\xA61ung:ling,ting,wing\xA61pt:eep\xA61ank:rink\xA61ore:bear,wear\xA61ave:give\xA61oze:reeze\xA61ound:rind,wind\xA61ook:take,hake\xA61aw:see\xA61old:sell\xA61ote:rite\xA61ole:teal\xA61unk:tink\xA61am:wim\xA61ay:lie\xA61ood:tand\xA61eld:hold\xA62d:he,ge,re,le,leed,ne,reed,be,ye,lee,pe,we\xA62ed:dd,oy,or,ey,gg,rr,us,ew,to\xA62ame:ecome,rcome\xA62ped:ap\xA62ged:ag,og,ug,eg\xA62bed:ub,ab,ib,ob\xA62lt:neel\xA62id:pay\xA62ang:pring\xA62ove:trive\xA62med:um\xA62ode:rride\xA62at:ysit\xA63ted:mit,hat,mat,lat,pot,rot,bat\xA63ed:low,end,tow,und,ond,eem,lay,cho,dow,xit,eld,ald,uld,law,lel,eat,oll,ray,ank,fin,oam,out,how,iek,tay,haw,ait,vet,say,cay,bow\xA63d:ste,ede,ode,ete,ree,ude,ame,oke,ote,ime,ute,ade\xA63red:lur,cur,pur,car\xA63ped:hop,rop,uip,rip,lip,tep,top\xA63ded:bed,rod,kid\xA63ade:orbid\xA63led:uel\xA63ned:lan,can,kin,pan,tun\xA63med:rim,lim\xA64ted:quit,llot\xA64ed:pear,rrow,rand,lean,mand,anel,pand,reet,link,abel,evel,imit,ceed,ruit,mind,peal,veal,hool,head,pell,well,mell,uell,band,hear,weak\xA64led:nnel,qual,ebel,ivel\xA64red:nfer,efer,sfer\xA64n:sake,trew\xA64d:ntee\xA64ded:hred\xA64ned:rpin\xA65ed:light,nceal,right,ndear,arget,hread,eight,rtial,eboot\xA65d:edite,nvite\xA65ted:egret\xA65led:ravel",
    "ex": "2:been,upped\xA63:added,aged,aided,aimed,aired,bid,died,dyed,egged,erred,eyed,fit,gassed,hit,lied,owed,pent,pied,tied,used,vied,oiled,outed,banned,barred,bet,canned,cut,dipped,donned,ended,feed,inked,jarred,let,manned,mowed,netted,padded,panned,pitted,popped,potted,put,set,sewn,sowed,tanned,tipped,topped,vowed,weed,bowed,jammed,binned,dimmed,hopped,mopped,nodded,pinned,rigged,sinned,towed,vetted\xA64:ached,baked,baled,boned,bored,called,caned,cared,ceded,cited,coded,cored,cubed,cured,dared,dined,edited,exited,faked,fared,filed,fined,fired,fuelled,gamed,gelled,hired,hoped,joked,lined,mined,named,noted,piled,poked,polled,pored,pulled,reaped,roamed,rolled,ruled,seated,shed,sided,timed,tolled,toned,voted,waited,walled,waned,winged,wiped,wired,zoned,yelled,tamed,lubed,roped,faded,mired,caked,honed,banged,culled,heated,raked,welled,banded,beat,cast,cooled,cost,dealt,feared,folded,footed,handed,headed,heard,hurt,knitted,landed,leaked,leapt,linked,meant,minded,molded,neared,needed,peaked,plodded,plotted,pooled,quit,read,rooted,sealed,seeded,seeped,shipped,shunned,skimmed,slammed,sparred,stemmed,stirred,suited,thinned,twinned,swayed,winked,dialed,abutted,blotted,fretted,healed,heeded,peeled,reeled\xA65:basted,cheated,equalled,eroded,exiled,focused,opined,pleated,primed,quoted,scouted,shored,sloped,smoked,sniped,spelled,spouted,routed,staked,stored,swelled,tasted,treated,wasted,smelled,dwelled,honored,prided,quelled,eloped,scared,coveted,sweated,breaded,cleared,debuted,deterred,freaked,modeled,pleaded,rebutted,speeded\xA66:anchored,defined,endured,impaled,invited,refined,revered,strolled,cringed,recast,thrust,unfolded\xA67:authored,combined,competed,conceded,convened,excreted,extruded,redefined,restored,secreted,rescinded,welcomed\xA68:expedited,infringed\xA69:interfered,intervened,persevered\xA610:contravened\xA6eat:ate\xA6is:was\xA6go:went\xA6are:were\xA63d:bent,lent,rent,sent\xA63e:bit,fled,hid,lost\xA63ed:bled,bred\xA62ow:blew,grew\xA61uy:bought\xA62tch:caught\xA61o:did\xA61ive:dove,gave\xA62aw:drew\xA62ed:fed\xA62y:flew,laid,paid,said\xA61ight:fought\xA61et:got\xA62ve:had\xA61ang:hung\xA62ad:led\xA62ght:lit\xA62ke:made\xA62et:met\xA61un:ran\xA61ise:rose\xA61it:sat\xA61eek:sought\xA61each:taught\xA61ake:woke,took\xA61eave:wove\xA62ise:arose\xA61ear:bore,tore,wore\xA61ind:bound,found,wound\xA62eak:broke\xA62ing:brought,wrung\xA61ome:came\xA62ive:drove\xA61ig:dug\xA61all:fell\xA62el:felt\xA64et:forgot\xA61old:held\xA62ave:left\xA61ing:rang,sang\xA61ide:rode\xA61ink:sank\xA61ee:saw\xA62ine:shone\xA64e:slid\xA61ell:sold,told\xA64d:spent\xA62in:spun\xA61in:won"
  },
  "PresentTense": {
    "fwd": "1:oes\xA61ve:as",
    "both": "1:xes\xA62:zzes,ches,shes,sses\xA63:iases\xA62y:llies,plies\xA61y:cies,bies,ties,vies,nies,pies,dies,ries,fies\xA6:s",
    "rev": "1ies:ly\xA62es:us,go,do\xA63es:cho,eto",
    "ex": "2:does,goes\xA63:gasses\xA65:focuses\xA6is:are\xA63y:relies\xA62y:flies\xA62ve:has"
  },
  "Superlative": {
    "fwd": "1st:e\xA61est:l,m,f,s\xA61iest:cey\xA62est:or,ir\xA63est:ver",
    "both": "4:east\xA65:hwest\xA65lest:erful\xA64est:weet,lgar,tter,oung\xA64most:uter\xA63est:ger,der,rey,iet,ong,ear\xA63test:lat\xA63most:ner\xA62est:pt,ft,nt,ct,rt,ht\xA62test:it\xA62gest:ig\xA61est:b,k,n,p,h,d,w\xA6iest:y",
    "rev": "1:ttest,nnest,yest\xA62:sest,stest,rmest,cest,vest,lmest,olest,ilest,ulest,ssest,imest,uest\xA63:rgest,eatest,oorest,plest,allest,urest,iefest,uelest,blest,ugest,amest,yalest,ealest,illest,tlest,itest\xA64:cerest,eriest,somest,rmalest,ndomest,motest,uarest,tiffest\xA65:leverest,rangest\xA6ar:urthest\xA63ey:riciest",
    "ex": "best:good\xA6worst:bad\xA65est:great\xA64est:fast,full,fair,dull\xA63test:hot,wet,fat\xA64nest:thin\xA61urthest:far\xA63est:gay,shy,ill\xA64test:neat\xA64st:late,wide,fine,safe,cute,fake,pale,rare,rude,sore,ripe,dire\xA66st:severe"
  },
  "AdjToNoun": {
    "fwd": "1:tistic,eable,lful,sful,ting,tty\xA62:onate,rtable,geous,ced,seful,ctful\xA63:ortive,ented\xA6arity:ear\xA6y:etic\xA6fulness:begone\xA61ity:re\xA61y:tiful,gic\xA62ity:ile,imous,ilous,ime\xA62ion:ated\xA62eness:iving\xA62y:trious\xA62ation:iring\xA62tion:vant\xA63ion:ect\xA63ce:mant,mantic\xA63tion:irable\xA63y:est,estic\xA63m:mistic,listic\xA63ess:ning\xA64n:utious\xA64on:rative,native,vative,ective\xA64ce:erant",
    "both": "1:king,wing\xA62:alous,ltuous,oyful,rdous\xA63:gorous,ectable,werful,amatic\xA64:oised,usical,agical,raceful,ocused,lined,ightful\xA65ness:stful,lding,itous,nuous,ulous,otous,nable,gious,ayful,rvous,ntous,lsive,peful,entle,ciful,osive,leful,isive,ncise,reful,mious\xA65ty:ivacious\xA65ties:ubtle\xA65ce:ilient,adiant,atient\xA65cy:icient\xA65sm:gmatic\xA65on:sessive,dictive\xA65ity:pular,sonal,eative,entic\xA65sity:uminous\xA65ism:conic\xA65nce:mperate\xA65ility:mitable\xA65ment:xcited\xA65n:bitious\xA64cy:brant,etent,curate\xA64ility:erable,acable,icable,ptable\xA64ty:nacious,aive,oyal,dacious\xA64n:icious\xA64ce:vient,erent,stent,ndent,dient,quent,ident\xA64ness:adic,ound,hing,pant,sant,oing,oist,tute\xA64icity:imple\xA64ment:fined,mused\xA64ism:otic\xA64ry:dantic\xA64ity:tund,eral\xA64edness:hand\xA64on:uitive\xA64lity:pitable\xA64sm:eroic,namic\xA64sity:nerous\xA63th:arm\xA63ility:pable,bable,dable,iable\xA63cy:hant,nant,icate\xA63ness:red,hin,nse,ict,iet,ite,oud,ind,ied,rce\xA63ion:lute\xA63ity:ual,gal,volous,ial\xA63ce:sent,fensive,lant,gant,gent,lent,dant\xA63on:asive\xA63m:fist,sistic,iastic\xA63y:terious,xurious,ronic,tastic\xA63ur:amorous\xA63e:tunate\xA63ation:mined\xA63sy:rteous\xA63ty:ain\xA63ry:ave\xA63ment:azed\xA62ness:de,on,ue,rn,ur,ft,rp,pe,om,ge,rd,od,ay,ss,er,ll,oy,ap,ht,ld,ad,rt\xA62inousness:umous\xA62ity:neous,ene,id,ane\xA62cy:bate,late\xA62ation:ized\xA62ility:oble,ible\xA62y:odic\xA62e:oving,aring\xA62s:ost\xA62itude:pt\xA62dom:ee\xA62ance:uring\xA62tion:reet\xA62ion:oted\xA62sion:ending\xA62liness:an\xA62or:rdent\xA61th:ung\xA61e:uable\xA61ness:w,h,k,f\xA61ility:mble\xA61or:vent\xA61ement:ging\xA61tiquity:ncient\xA61ment:hed\xA6verty:or\xA6ength:ong\xA6eat:ot\xA6pth:ep\xA6iness:y",
    "rev": "",
    "ex": "5:forceful,humorous\xA68:charismatic\xA613:understanding\xA65ity:active\xA611ness:adventurous,inquisitive,resourceful\xA68on:aggressive,automatic,perceptive\xA67ness:amorous,fatuous,furtive,ominous,serious\xA65ness:ample,sweet\xA612ness:apprehensive,cantankerous,contemptuous,ostentatious\xA613ness:argumentative,conscientious\xA69ness:assertive,facetious,imperious,inventive,oblivious,rapacious,receptive,seditious,whimsical\xA610ness:attractive,expressive,impressive,loquacious,salubrious,thoughtful\xA63edom:boring\xA64ness:calm,fast,keen,tame\xA68ness:cheerful,gracious,specious,spurious,timorous,unctuous\xA65sity:curious\xA69ion:deliberate\xA68ion:desperate\xA66e:expensive\xA67ce:fragrant\xA63y:furious\xA69ility:ineluctable\xA66ism:mystical\xA68ity:physical,proactive,sensitive,vertical\xA65cy:pliant\xA67ity:positive\xA69ity:practical\xA612ism:professional\xA66ce:prudent\xA63ness:red\xA66cy:vagrant\xA63dom:wise"
  }
};
const checkEx = function(str, ex = {}) {
  if (ex.hasOwnProperty(str)) {
    return ex[str];
  }
  return null;
};
const checkSame = function(str, same = []) {
  for (let i2 = 0; i2 < same.length; i2 += 1) {
    if (str.endsWith(same[i2])) {
      return str;
    }
  }
  return null;
};
const checkRules = function(str, fwd, both = {}) {
  fwd = fwd || {};
  let max2 = str.length - 1;
  for (let i2 = max2; i2 >= 1; i2 -= 1) {
    let size = str.length - i2;
    let suff = str.substring(size, str.length);
    if (fwd.hasOwnProperty(suff) === true) {
      return str.slice(0, size) + fwd[suff];
    }
    if (both.hasOwnProperty(suff) === true) {
      return str.slice(0, size) + both[suff];
    }
  }
  if (fwd.hasOwnProperty("")) {
    return str += fwd[""];
  }
  if (both.hasOwnProperty("")) {
    return str += both[""];
  }
  return null;
};
const convert = function(str = "", model2 = {}) {
  let out2 = checkEx(str, model2.ex);
  out2 = out2 || checkSame(str, model2.same);
  out2 = out2 || checkRules(str, model2.fwd, model2.both);
  out2 = out2 || str;
  return out2;
};
var convert$1 = convert;
const flipObj = function(obj) {
  return Object.entries(obj).reduce((h2, a2) => {
    h2[a2[1]] = a2[0];
    return h2;
  }, {});
};
const reverse = function(model2 = {}) {
  return {
    reversed: true,
    both: flipObj(model2.both),
    ex: flipObj(model2.ex),
    fwd: model2.rev || {}
  };
};
var reverse$1 = reverse;
const prefix$2 = /^([0-9]+)/;
const toObject = function(txt) {
  let obj = {};
  txt.split("\xA6").forEach((str) => {
    let [key, vals] = str.split(":");
    vals = (vals || "").split(",");
    vals.forEach((val) => {
      obj[val] = key;
    });
  });
  return obj;
};
const growObject = function(key = "", val = "") {
  val = String(val);
  let m2 = val.match(prefix$2);
  if (m2 === null) {
    return val;
  }
  let num = Number(m2[1]) || 0;
  let pre = key.substring(0, num);
  let full = pre + val.replace(prefix$2, "");
  return full;
};
const unpackOne = function(str) {
  let obj = toObject(str);
  return Object.keys(obj).reduce((h2, k2) => {
    h2[k2] = growObject(k2, obj[k2]);
    return h2;
  }, {});
};
const uncompress = function(model2 = {}) {
  if (typeof model2 === "string") {
    model2 = JSON.parse(model2);
  }
  model2.fwd = unpackOne(model2.fwd || "");
  model2.both = unpackOne(model2.both || "");
  model2.rev = unpackOne(model2.rev || "");
  model2.ex = unpackOne(model2.ex || "");
  return model2;
};
var uncompress$1 = uncompress;
const fromPast = uncompress$1(data.PastTense);
const fromPresent = uncompress$1(data.PresentTense);
const fromGerund = uncompress$1(data.Gerund);
const fromParticiple = uncompress$1(data.Participle);
const toPast$5 = reverse$1(fromPast);
const toPresent$4 = reverse$1(fromPresent);
const toGerund$3 = reverse$1(fromGerund);
const toParticiple$1 = reverse$1(fromParticiple);
const toComparative$1 = uncompress$1(data.Comparative);
const toSuperlative$1 = uncompress$1(data.Superlative);
const fromComparative$1 = reverse$1(toComparative$1);
const fromSuperlative$1 = reverse$1(toSuperlative$1);
const adjToNoun = uncompress$1(data.AdjToNoun);
var models = {
  fromPast,
  fromPresent,
  fromGerund,
  fromParticiple,
  toPast: toPast$5,
  toPresent: toPresent$4,
  toGerund: toGerund$3,
  toParticiple: toParticiple$1,
  toComparative: toComparative$1,
  toSuperlative: toSuperlative$1,
  fromComparative: fromComparative$1,
  fromSuperlative: fromSuperlative$1,
  adjToNoun
};
var regexNormal = [
  [/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, "Email"],
  [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, "Url", "http.."],
  [/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/, "Url", ".com"],
  [/^[PMCE]ST$/, "Timezone", "EST"],
  [/^ma?c'.*/, "LastName", "mc'neil"],
  [/^o'[drlkn].*/, "LastName", "o'connor"],
  [/^ma?cd[aeiou]/, "LastName", "mcdonald"],
  [/^(lol)+[sz]$/, "Expression", "lol"],
  [/^wo{2,}a*h?$/, "Expression", "wooah"],
  [/^(hee?){2,}h?$/, "Expression", "hehe"],
  [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, "Verb", "un-vite"],
  [/^(m|k|cm|km)\/(s|h|hr)$/, "Unit", "5 k/m"],
  [/^(ug|ng|mg)\/(l|m3|ft3)$/, "Unit", "ug/L"]
];
var regexText = [
  [/^#[\p{Number}_]*\p{Letter}/u, "HashTag"],
  [/^@\w{2,}$/, "AtMention"],
  [/^([A-Z]\.){2}[A-Z]?/i, ["Acronym", "Noun"], "F.B.I"],
  [/.{3}[lkmnp]in['‘’‛‵′`´]$/, "Gerund", "chillin'"],
  [/.{4}s['‘’‛‵′`´]$/, "Possessive", "flanders'"],
  [/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u, "Emoji", "emoji-class"]
];
var regexNumbers = [
  [/^@1?[0-9](am|pm)$/i, "Time", "3pm"],
  [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, "Time", "3:30pm"],
  [/^'[0-9]{2}$/, "Year"],
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, "Time", "3:12:31"],
  [/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i, "Time", "1:12pm"],
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i, "Time", "1:12:31pm"],
  [/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i, "Date", "iso-date"],
  [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, "Date", "iso-dash"],
  [/^[0-9]{1,4}\/[0-9]{1,2}\/([0-9]{4}|[0-9]{2})$/, "Date", "iso-slash"],
  [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, "Date", "iso-dot"],
  [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, "Date", "12-dec-2019"],
  [/^utc ?[+-]?[0-9]+$/, "Timezone", "utc-9"],
  [/^(gmt|utc)[+-][0-9]{1,2}$/i, "Timezone", "gmt-3"],
  [/^[0-9]{3}-[0-9]{4}$/, "PhoneNumber", "421-0029"],
  [/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/, "PhoneNumber", "1-800-"],
  [
    /^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u,
    ["Money", "Value"],
    "$5.30"
  ],
  [
    /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u,
    ["Money", "Value"],
    "5.30\xA3"
  ],
  [/^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i, ["Money", "Value"], "$400usd"],
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/, ["Cardinal", "NumericValue"], "5,999"],
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/, ["Ordinal", "NumericValue"], "53rd"],
  [/^\.[0-9]+\+?$/, ["Cardinal", "NumericValue"], ".73th"],
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/, ["Percent", "Cardinal", "NumericValue"], "-4%"],
  [/^\.[0-9]+%$/, ["Percent", "Cardinal", "NumericValue"], ".3%"],
  [/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/, ["Fraction", "NumericValue"], "2/3rds"],
  [/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/, ["Value", "NumberRange"], "3-4"],
  [/^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/, ["Time", "NumberRange"], "3-4pm"],
  [/^[0-9.]+([a-z°]{1,4})$/, "NumericValue", "9km"]
];
var orgWords$1 = [
  "academy",
  "administration",
  "agence",
  "agences",
  "agencies",
  "agency",
  "airlines",
  "airways",
  "army",
  "assoc",
  "associates",
  "association",
  "assurance",
  "authority",
  "autorite",
  "aviation",
  "bank",
  "banque",
  "board",
  "boys",
  "brands",
  "brewery",
  "brotherhood",
  "brothers",
  "bureau",
  "cafe",
  "co",
  "caisse",
  "capital",
  "care",
  "cathedral",
  "center",
  "centre",
  "chemicals",
  "choir",
  "chronicle",
  "church",
  "circus",
  "clinic",
  "clinique",
  "club",
  "co",
  "coalition",
  "coffee",
  "collective",
  "college",
  "commission",
  "committee",
  "communications",
  "community",
  "company",
  "comprehensive",
  "computers",
  "confederation",
  "conference",
  "conseil",
  "consulting",
  "containers",
  "corporation",
  "corps",
  "corp",
  "council",
  "crew",
  "data",
  "departement",
  "department",
  "departments",
  "design",
  "development",
  "directorate",
  "division",
  "drilling",
  "education",
  "eglise",
  "electric",
  "electricity",
  "energy",
  "ensemble",
  "enterprise",
  "enterprises",
  "entertainment",
  "estate",
  "etat",
  "faculty",
  "federation",
  "financial",
  "fm",
  "foundation",
  "fund",
  "gas",
  "gazette",
  "girls",
  "government",
  "group",
  "guild",
  "herald",
  "holdings",
  "hospital",
  "hotel",
  "hotels",
  "inc",
  "industries",
  "institut",
  "institute",
  "institutes",
  "insurance",
  "international",
  "interstate",
  "investment",
  "investments",
  "investors",
  "journal",
  "laboratory",
  "labs",
  "llc",
  "ltd",
  "limited",
  "machines",
  "magazine",
  "management",
  "marine",
  "marketing",
  "markets",
  "media",
  "memorial",
  "ministere",
  "ministry",
  "military",
  "mobile",
  "motor",
  "motors",
  "musee",
  "museum",
  "news",
  "observatory",
  "office",
  "oil",
  "optical",
  "orchestra",
  "organization",
  "partners",
  "partnership",
  "petrol",
  "petroleum",
  "pharmacare",
  "pharmaceutical",
  "pharmaceuticals",
  "pizza",
  "plc",
  "police",
  "polytechnic",
  "post",
  "power",
  "press",
  "productions",
  "quartet",
  "radio",
  "reserve",
  "resources",
  "restaurant",
  "restaurants",
  "savings",
  "school",
  "securities",
  "service",
  "services",
  "societe",
  "society",
  "sons",
  "subcommittee",
  "syndicat",
  "systems",
  "telecommunications",
  "telegraph",
  "television",
  "times",
  "tribunal",
  "tv",
  "union",
  "university",
  "utilities",
  "workers"
].reduce((h2, str) => {
  h2[str] = true;
  return h2;
}, {});
var rules$1 = [
  [/([^v])ies$/i, "$1y"],
  [/(ise)s$/i, "$1"],
  [/(kn|[^o]l|w)ives$/i, "$1ife"],
  [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f"],
  [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f"],
  [/(antenn|formul|nebul|vertebr|vit)ae$/i, "$1a"],
  [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, "$1us"],
  [/(buffal|tomat|tornad)(oes)$/i, "$1o"],
  [/(ause)s$/i, "$1"],
  [/(ease)s$/i, "$1"],
  [/(ious)es$/i, "$1"],
  [/(ouse)s$/i, "$1"],
  [/(ose)s$/i, "$1"],
  [/(..ase)s$/i, "$1"],
  [/(..[aeiu]s)es$/i, "$1"],
  [/(vert|ind|cort)(ices)$/i, "$1ex"],
  [/(matr|append)(ices)$/i, "$1ix"],
  [/([xo]|ch|ss|sh)es$/i, "$1"],
  [/men$/i, "man"],
  [/(n)ews$/i, "$1ews"],
  [/([ti])a$/i, "$1um"],
  [/([^aeiouy]|qu)ies$/i, "$1y"],
  [/(s)eries$/i, "$1eries"],
  [/(m)ovies$/i, "$1ovie"],
  [/(cris|ax|test)es$/i, "$1is"],
  [/(alias|status)es$/i, "$1"],
  [/(ss)$/i, "$1"],
  [/(ic)s$/i, "$1"],
  [/s$/i, ""]
];
const invertObj = function(obj) {
  return Object.keys(obj).reduce((h2, k2) => {
    h2[obj[k2]] = k2;
    return h2;
  }, {});
};
const toSingular$1 = function(str, model2) {
  const { irregularPlurals: irregularPlurals2 } = model2.two;
  let invert = invertObj(irregularPlurals2);
  if (invert.hasOwnProperty(str)) {
    return invert[str];
  }
  for (let i2 = 0; i2 < rules$1.length; i2++) {
    if (rules$1[i2][0].test(str) === true) {
      str = str.replace(rules$1[i2][0], rules$1[i2][1]);
      return str;
    }
  }
  return str;
};
var toSingular$2 = toSingular$1;
const all$2 = function(str, model2) {
  let arr = [str];
  let p2 = toPlural$1(str, model2);
  if (p2 !== str) {
    arr.push(p2);
  }
  let s2 = toSingular$2(str, model2);
  if (s2 !== str) {
    arr.push(s2);
  }
  return arr;
};
var nouns$2 = { toPlural: toPlural$1, toSingular: toSingular$2, all: all$2 };
let guessVerb = {
  Gerund: ["ing"],
  Actor: ["erer"],
  Infinitive: [
    "ate",
    "ize",
    "tion",
    "rify",
    "then",
    "ress",
    "ify",
    "age",
    "nce",
    "ect",
    "ise",
    "ine",
    "ish",
    "ace",
    "ash",
    "ure",
    "tch",
    "end",
    "ack",
    "and",
    "ute",
    "ade",
    "ock",
    "ite",
    "ase",
    "ose",
    "use",
    "ive",
    "int",
    "nge",
    "lay",
    "est",
    "ain",
    "ant",
    "ent",
    "eed",
    "er",
    "le",
    "unk",
    "ung",
    "upt",
    "en"
  ],
  PastTense: ["ept", "ed", "lt", "nt", "ew", "ld"],
  PresentTense: [
    "rks",
    "cks",
    "nks",
    "ngs",
    "mps",
    "tes",
    "zes",
    "ers",
    "les",
    "acks",
    "ends",
    "ands",
    "ocks",
    "lays",
    "eads",
    "lls",
    "els",
    "ils",
    "ows",
    "nds",
    "ays",
    "ams",
    "ars",
    "ops",
    "ffs",
    "als",
    "urs",
    "lds",
    "ews",
    "ips",
    "es",
    "ts",
    "ns"
  ],
  Participle: ["ken", "wn"]
};
guessVerb = Object.keys(guessVerb).reduce((h2, k2) => {
  guessVerb[k2].forEach((a2) => h2[a2] = k2);
  return h2;
}, {});
var guess = guessVerb;
const getTense$1 = function(str) {
  let three = str.substring(str.length - 3);
  if (guess.hasOwnProperty(three) === true) {
    return guess[three];
  }
  let two = str.substring(str.length - 2);
  if (guess.hasOwnProperty(two) === true) {
    return guess[two];
  }
  let one = str.substring(str.length - 1);
  if (one === "s") {
    return "PresentTense";
  }
  return null;
};
var getTense$2 = getTense$1;
const toParts = function(str, model2) {
  let prefix2 = "";
  let prefixes2 = {};
  if (model2.one && model2.one.prefixes) {
    prefixes2 = model2.one.prefixes;
  }
  let [verb2, particle] = str.split(/ /);
  if (particle && prefixes2[verb2] === true) {
    prefix2 = verb2;
    verb2 = particle;
    particle = "";
  }
  return {
    prefix: prefix2,
    verb: verb2,
    particle
  };
};
const copulaMap = {
  are: "be",
  were: "be",
  been: "be",
  is: "be",
  am: "be",
  was: "be",
  be: "be",
  being: "be"
};
const toInfinitive$2 = function(str, model2, tense) {
  const { fromPast: fromPast2, fromPresent: fromPresent2, fromGerund: fromGerund2, fromParticiple: fromParticiple2 } = model2.two.models;
  let { prefix: prefix2, verb: verb2, particle } = toParts(str, model2);
  let inf = "";
  if (!tense) {
    tense = getTense$2(str);
  }
  if (copulaMap.hasOwnProperty(str)) {
    inf = copulaMap[str];
  } else if (tense === "Participle") {
    inf = convert$1(verb2, fromParticiple2);
  } else if (tense === "PastTense") {
    inf = convert$1(verb2, fromPast2);
  } else if (tense === "PresentTense") {
    inf = convert$1(verb2, fromPresent2);
  } else if (tense === "Gerund") {
    inf = convert$1(verb2, fromGerund2);
  } else {
    return str;
  }
  if (particle) {
    inf += " " + particle;
  }
  if (prefix2) {
    inf = prefix2 + " " + inf;
  }
  return inf;
};
var toInfinitive$3 = toInfinitive$2;
const parse$6 = (inf) => {
  if (/ /.test(inf)) {
    return inf.split(/ /);
  }
  return [inf, ""];
};
const conjugate = function(inf, model2) {
  const { toPast: toPast2, toPresent: toPresent2, toGerund: toGerund2, toParticiple: toParticiple2 } = model2.two.models;
  if (inf === "be") {
    return {
      Infinitive: inf,
      Gerund: "being",
      PastTense: "was",
      PresentTense: "is"
    };
  }
  let [str, particle] = parse$6(inf);
  let found = {
    Infinitive: str,
    PastTense: convert$1(str, toPast2),
    PresentTense: convert$1(str, toPresent2),
    Gerund: convert$1(str, toGerund2),
    FutureTense: "will " + str
  };
  let pastPrt = convert$1(str, toParticiple2);
  if (pastPrt !== inf && pastPrt !== found.PastTense) {
    let lex = model2.one.lexicon || {};
    if (lex[pastPrt] === "Participle" || lex[pastPrt] === "Adjective") {
      if (inf === "play") {
        pastPrt = "played";
      }
      found.Participle = pastPrt;
    }
  }
  if (particle) {
    Object.keys(found).forEach((k2) => {
      found[k2] += " " + particle;
    });
  }
  return found;
};
var conjugate$1 = conjugate;
const all$1 = function(str, model2) {
  let res = conjugate$1(str, model2);
  delete res.FutureTense;
  return Object.values(res).filter((s2) => s2);
};
var verbs$3 = {
  toInfinitive: toInfinitive$3,
  conjugate: conjugate$1,
  all: all$1
};
const toSuperlative = function(adj2, model2) {
  const mod = model2.two.models.toSuperlative;
  return convert$1(adj2, mod);
};
const toComparative = function(adj2, model2) {
  const mod = model2.two.models.toComparative;
  return convert$1(adj2, mod);
};
const fromComparative = function(adj2, model2) {
  const mod = model2.two.models.fromComparative;
  return convert$1(adj2, mod);
};
const fromSuperlative = function(adj2, model2) {
  const mod = model2.two.models.fromSuperlative;
  return convert$1(adj2, mod);
};
const toNoun = function(adj2, model2) {
  const mod = model2.two.models.adjToNoun;
  return convert$1(adj2, mod);
};
const suffixLoop$1 = function(str = "", suffixes2 = []) {
  const len = str.length;
  let max2 = len <= 6 ? len - 1 : 6;
  for (let i2 = max2; i2 >= 1; i2 -= 1) {
    let suffix = str.substring(len - i2, str.length);
    if (suffixes2[suffix.length].hasOwnProperty(suffix) === true) {
      let pre = str.slice(0, len - i2);
      let post = suffixes2[suffix.length][suffix];
      return pre + post;
    }
  }
  return null;
};
var doRules = suffixLoop$1;
const s = "ically";
const ical = /* @__PURE__ */ new Set([
  "analyt" + s,
  "chem" + s,
  "class" + s,
  "clin" + s,
  "crit" + s,
  "ecolog" + s,
  "electr" + s,
  "empir" + s,
  "frant" + s,
  "grammat" + s,
  "ident" + s,
  "ideolog" + s,
  "log" + s,
  "mag" + s,
  "mathemat" + s,
  "mechan" + s,
  "med" + s,
  "method" + s,
  "method" + s,
  "mus" + s,
  "phys" + s,
  "phys" + s,
  "polit" + s,
  "pract" + s,
  "rad" + s,
  "satir" + s,
  "statist" + s,
  "techn" + s,
  "technolog" + s,
  "theoret" + s,
  "typ" + s,
  "vert" + s,
  "whims" + s
]);
const suffixes$2 = [
  null,
  {},
  { "ly": "" },
  {
    "ily": "y",
    "bly": "ble",
    "ply": "ple"
  },
  {
    "ally": "al",
    "rply": "rp"
  },
  {
    "ually": "ual",
    "ially": "ial",
    "cally": "cal",
    "eally": "eal",
    "rally": "ral",
    "nally": "nal",
    "mally": "mal",
    "eeply": "eep",
    "eaply": "eap"
  },
  {
    ically: "ic"
  }
];
const noAdj = /* @__PURE__ */ new Set([
  "early",
  "only",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "mostly",
  "duly",
  "unduly",
  "especially",
  "undoubtedly",
  "conversely",
  "namely",
  "exceedingly",
  "presumably",
  "accordingly",
  "overly",
  "best",
  "latter",
  "little",
  "long",
  "low"
]);
const exceptions$2 = {
  wholly: "whole",
  fully: "full",
  truly: "true",
  gently: "gentle",
  singly: "single",
  customarily: "customary",
  idly: "idle",
  publically: "public",
  quickly: "quick",
  superbly: "superb",
  cynically: "cynical",
  well: "good"
};
const toAdjective = function(str) {
  if (!str.endsWith("ly")) {
    return null;
  }
  if (ical.has(str)) {
    return str.replace(/ically/, "ical");
  }
  if (noAdj.has(str)) {
    return null;
  }
  if (exceptions$2.hasOwnProperty(str)) {
    return exceptions$2[str];
  }
  return doRules(str, suffixes$2) || str;
};
var fromAdverb = toAdjective;
const suffixes$1 = [
  null,
  {
    y: "ily"
  },
  {
    ly: "ly",
    ic: "ically"
  },
  {
    ial: "ially",
    ual: "ually",
    tle: "tly",
    ble: "bly",
    ple: "ply",
    ary: "arily"
  },
  {},
  {},
  {}
];
const exceptions$1 = {
  cool: "cooly",
  whole: "wholly",
  full: "fully",
  good: "well",
  idle: "idly",
  public: "publicly",
  single: "singly",
  special: "especially"
};
const toAdverb = function(str) {
  if (exceptions$1.hasOwnProperty(str)) {
    return exceptions$1[str];
  }
  let adv2 = doRules(str, suffixes$1);
  if (!adv2) {
    adv2 = str + "ly";
  }
  return adv2;
};
var toAdverb$1 = toAdverb;
const all = function(str, model2) {
  let arr = [str];
  arr.push(toSuperlative(str, model2));
  arr.push(toComparative(str, model2));
  arr.push(toAdverb$1(str));
  arr = arr.filter((s2) => s2);
  arr = new Set(arr);
  return Array.from(arr);
};
var adjectives$1 = {
  toSuperlative,
  toComparative,
  toAdverb: toAdverb$1,
  toNoun,
  fromAdverb,
  fromSuperlative,
  fromComparative,
  all
};
var transform = {
  noun: nouns$2,
  verb: verbs$3,
  adjective: adjectives$1
};
var fancyThings = {
  Singular: (word, lex, methods2, model2) => {
    let already = model2.one.lexicon;
    let plural2 = methods2.two.transform.noun.toPlural(word, model2);
    if (!already[plural2]) {
      lex[plural2] = lex[plural2] || "Plural";
    }
  },
  Actor: (word, lex, methods2, model2) => {
    let already = model2.one.lexicon;
    let plural2 = methods2.two.transform.noun.toPlural(word, model2);
    if (!already[plural2]) {
      lex[plural2] = lex[plural2] || ["Plural", "Actor"];
    }
  },
  Comparable: (word, lex, methods2, model2) => {
    let already = model2.one.lexicon;
    let { toSuperlative: toSuperlative2, toComparative: toComparative2 } = methods2.two.transform.adjective;
    let sup = toSuperlative2(word, model2);
    if (!already[sup]) {
      lex[sup] = lex[sup] || "Superlative";
    }
    let comp = toComparative2(word, model2);
    if (!already[comp]) {
      lex[comp] = lex[comp] || "Comparative";
    }
    lex[word] = "Adjective";
  },
  Demonym: (word, lex, methods2, model2) => {
    let plural2 = methods2.two.transform.noun.toPlural(word, model2);
    lex[plural2] = lex[plural2] || ["Demonym", "Plural"];
  },
  Infinitive: (word, lex, methods2, model2) => {
    let already = model2.one.lexicon;
    let all2 = methods2.two.transform.verb.conjugate(word, model2);
    Object.entries(all2).forEach((a2) => {
      if (!already[a2[1]] && !lex[a2[1]]) {
        lex[a2[1]] = a2[0];
      }
    });
  },
  PhrasalVerb: (word, lex, methods2, model2) => {
    let already = model2.one.lexicon;
    lex[word] = ["PhrasalVerb", "Infinitive"];
    let _multi = model2.one._multiCache;
    let [inf, rest] = word.split(" ");
    if (!already[inf]) {
      lex[inf] = lex[inf] || "Infinitive";
    }
    let all2 = methods2.two.transform.verb.conjugate(inf, model2);
    delete all2.FutureTense;
    Object.entries(all2).forEach((a2) => {
      if (a2[0] === "Actor" || a2[1] === "") {
        return;
      }
      if (!lex[a2[1]] && !already[a2[1]]) {
        lex[a2[1]] = a2[0];
      }
      _multi[a2[1]] = true;
      let str = a2[1] + " " + rest;
      lex[str] = lex[str] || [a2[0], "PhrasalVerb"];
    });
  },
  Multiple: (word, lex) => {
    lex[word] = ["Multiple", "Cardinal"];
    lex[word + "th"] = ["Multiple", "Ordinal"];
    lex[word + "ths"] = ["Multiple", "Fraction"];
  },
  Cardinal: (word, lex) => {
    lex[word] = ["TextValue", "Cardinal"];
  },
  Ordinal: (word, lex) => {
    lex[word] = ["TextValue", "Ordinal"];
    lex[word + "s"] = ["TextValue", "Fraction"];
  },
  Place: (word, lex) => {
    lex[word] = ["Place", "ProperNoun"];
  },
  Region: (word, lex) => {
    lex[word] = ["Region", "ProperNoun"];
  }
};
const expand$1 = function(words2, world2) {
  const { methods: methods2, model: model2 } = world2;
  let lex = {};
  let _multi = {};
  Object.keys(words2).forEach((word) => {
    let tag2 = words2[word];
    word = word.toLowerCase().trim();
    word = word.replace(/'s\b/, "");
    let split2 = word.split(/ /);
    if (split2.length > 1) {
      _multi[split2[0]] = true;
    }
    if (fancyThings.hasOwnProperty(tag2) === true) {
      fancyThings[tag2](word, lex, methods2, model2);
    }
    lex[word] = lex[word] || tag2;
  });
  delete lex[""];
  delete lex[null];
  delete lex[" "];
  return { lex, _multi };
};
var expandLexicon$2 = expand$1;
const splitOn = function(terms, i2) {
  const isNum = /^[0-9]+$/;
  let term = terms[i2];
  if (!term) {
    return false;
  }
  const maybeDate = /* @__PURE__ */ new Set(["may", "april", "august", "jan"]);
  if (term.normal === "like" || maybeDate.has(term.normal)) {
    return false;
  }
  if (term.tags.has("Place") || term.tags.has("Date")) {
    return false;
  }
  if (terms[i2 - 1]) {
    let lastTerm = terms[i2 - 1];
    if (lastTerm.tags.has("Date") || maybeDate.has(lastTerm.normal)) {
      return false;
    }
    if (lastTerm.tags.has("Adjective") || term.tags.has("Adjective")) {
      return false;
    }
  }
  let str = term.normal;
  if (str.length === 1 || str.length === 2 || str.length === 4) {
    if (isNum.test(str)) {
      return false;
    }
  }
  return true;
};
const quickSplit = function(document2) {
  const splitHere = /[,:;]/;
  let arr = [];
  document2.forEach((terms) => {
    let start2 = 0;
    terms.forEach((term, i2) => {
      if (splitHere.test(term.post) && splitOn(terms, i2 + 1)) {
        arr.push(terms.slice(start2, i2 + 1));
        start2 = i2 + 1;
      }
    });
    if (start2 < terms.length) {
      arr.push(terms.slice(start2, terms.length));
    }
  });
  return arr;
};
var quickSplit$1 = quickSplit;
const isPlural$4 = {
  e: [
    "mice",
    "louse",
    "antennae",
    "formulae",
    "nebulae",
    "vertebrae",
    "vitae"
  ],
  i: [
    "tia",
    "octopi",
    "viri",
    "radii",
    "nuclei",
    "fungi",
    "cacti",
    "stimuli"
  ],
  n: [
    "men"
  ],
  t: [
    "feet"
  ]
};
const exceptions = /* @__PURE__ */ new Set([
  "israelis",
  "menus"
]);
const notPlural$1 = [
  "bus",
  "mas",
  "was",
  "ias",
  "xas",
  "vas",
  "cis",
  "lis",
  "nis",
  "ois",
  "ris",
  "sis",
  "tis",
  "xis",
  "aus",
  "cus",
  "eus",
  "fus",
  "gus",
  "ius",
  "lus",
  "nus",
  "ous",
  "pus",
  "rus",
  "sus",
  "tus",
  "xus",
  "'s",
  "ss"
];
const looksPlural = function(str) {
  if (!str || str.length <= 3) {
    return false;
  }
  if (exceptions.has(str)) {
    return true;
  }
  let end2 = str[str.length - 1];
  if (isPlural$4.hasOwnProperty(end2)) {
    return isPlural$4[end2].find((suff) => str.endsWith(suff));
  }
  if (end2 !== "s") {
    return false;
  }
  if (notPlural$1.find((suff) => str.endsWith(suff))) {
    return false;
  }
  return true;
};
var looksPlural$1 = looksPlural;
var methods$1 = {
  two: {
    quickSplit: quickSplit$1,
    expandLexicon: expandLexicon$2,
    transform,
    looksPlural: looksPlural$1
  }
};
const expandIrregulars = function(model2) {
  const { irregularPlurals: irregularPlurals2 } = model2.two;
  const { lexicon: lexicon2 } = model2.one;
  Object.entries(irregularPlurals2).forEach((a2) => {
    lexicon2[a2[0]] = lexicon2[a2[0]] || "Singular";
    lexicon2[a2[1]] = lexicon2[a2[1]] || "Plural";
  });
  return model2;
};
var expandIrregulars$1 = expandIrregulars;
let tmpModel = {
  one: { lexicon: {} },
  two: { models }
};
const switchDefaults = {
  "Actor|Verb": "Actor",
  "Adj|Gerund": "Adjective",
  "Adj|Noun": "Adjective",
  "Adj|Past": "Adjective",
  "Adj|Present": "Adjective",
  "Noun|Verb": "Singular",
  "Noun|Gerund": "Gerund",
  "Person|Noun": "Noun",
  "Person|Date": "Month",
  "Person|Verb": "FirstName",
  "Person|Place": "Person",
  "Person|Adj": "Comparative",
  "Plural|Verb": "Plural",
  "Unit|Noun": "Noun"
};
const expandLexicon = function(words2, model2) {
  const world2 = { model: model2, methods: methods$1 };
  let { lex, _multi } = methods$1.two.expandLexicon(words2, world2);
  Object.assign(model2.one.lexicon, lex);
  Object.assign(model2.one._multiCache, _multi);
  return model2;
};
const addUncountables = function(words2, model2) {
  Object.keys(words2).forEach((k2) => {
    if (words2[k2] === "Uncountable") {
      model2.two.uncountable[k2] = true;
      words2[k2] = "Uncountable";
    }
  });
  return model2;
};
const expandVerb = function(str, words2, doPresent) {
  let obj = conjugate$1(str, tmpModel);
  words2[obj.PastTense] = words2[obj.PastTense] || "PastTense";
  words2[obj.Gerund] = words2[obj.Gerund] || "Gerund";
  if (doPresent === true) {
    words2[obj.PresentTense] = words2[obj.PresentTense] || "PresentTense";
  }
};
const expandAdjective = function(str, words2, model2) {
  let sup = toSuperlative(str, model2);
  words2[sup] = words2[sup] || "Superlative";
  let comp = toComparative(str, model2);
  words2[comp] = words2[comp] || "Comparative";
};
const expandNoun = function(str, words2, model2) {
  let plur = toPlural$1(str, model2);
  words2[plur] = words2[plur] || "Plural";
};
const expandVariable = function(switchWords, model2) {
  let words2 = {};
  const lex = model2.one.lexicon;
  Object.keys(switchWords).forEach((w) => {
    const name = switchWords[w];
    words2[w] = switchDefaults[name];
    if (name === "Noun|Verb" || name === "Person|Verb" || name === "Actor|Verb") {
      expandVerb(w, lex, false);
    }
    if (name === "Adj|Present") {
      expandVerb(w, lex, true);
      expandAdjective(w, lex, model2);
    }
    if (name === "Person|Adj") {
      expandAdjective(w, lex, model2);
    }
    if (name === "Adj|Gerund" || name === "Noun|Gerund") {
      let inf = toInfinitive$3(w, tmpModel, "Gerund");
      if (!lex[inf]) {
        words2[inf] = "Infinitive";
      }
    }
    if (name === "Noun|Gerund" || name === "Adj|Noun" || name === "Person|Noun") {
      expandNoun(w, lex, model2);
    }
    if (name === "Adj|Past") {
      let inf = toInfinitive$3(w, tmpModel, "PastTense");
      if (!lex[inf]) {
        words2[inf] = "Infinitive";
      }
    }
  });
  model2 = expandLexicon(words2, model2);
  return model2;
};
const expand = function(model2) {
  model2 = expandLexicon(model2.one.lexicon, model2);
  model2 = addUncountables(model2.one.lexicon, model2);
  model2 = expandVariable(model2.two.switches, model2);
  model2 = expandIrregulars$1(model2);
  return model2;
};
var expandLexicon$1 = expand;
let model$1 = {
  one: {
    _multiCache: {},
    lexicon
  },
  two: {
    irregularPlurals,
    models,
    suffixPatterns,
    prefixPatterns,
    endsWith,
    neighbours: neighbours$2,
    regexNormal,
    regexText,
    regexNumbers,
    switches: switches$1,
    clues: clues$1,
    uncountable: {},
    orgWords: orgWords$1
  }
};
model$1 = expandLexicon$1(model$1);
var model$2 = model$1;
const byPunctuation = function(terms, i2, model2, world2) {
  const setTag2 = world2.methods.one.setTag;
  if (i2 === 0 && terms.length >= 3) {
    const hasColon = /:/;
    let post = terms[0].post;
    if (post.match(hasColon)) {
      let nextTerm = terms[1];
      if (nextTerm.tags.has("Value") || nextTerm.tags.has("Email") || nextTerm.tags.has("PhoneNumber")) {
        return;
      }
      setTag2([terms[0]], "Expression", world2, null, `2-punct-colon''`);
    }
  }
};
var colons = byPunctuation;
const byHyphen = function(terms, i2, model2, world2) {
  const setTag2 = world2.methods.one.setTag;
  if (terms[i2].post === "-" && terms[i2 + 1]) {
    setTag2([terms[i2], terms[i2 + 1]], "Hyphenated", world2, null, `1-punct-hyphen''`);
  }
};
var hyphens = byHyphen;
const prefix$1 = /^(under|over|mis|re|un|dis|semi)-?/;
const tagSwitch = function(terms, i2, model2) {
  const switches2 = model2.two.switches;
  let term = terms[i2];
  if (switches2.hasOwnProperty(term.normal)) {
    term.switch = switches2[term.normal];
    return;
  }
  if (prefix$1.test(term.normal)) {
    let stem = term.normal.replace(prefix$1, "");
    if (stem.length > 3 && switches2.hasOwnProperty(stem)) {
      term.switch = switches2[stem];
    }
  }
};
var tagSwitch$1 = tagSwitch;
const log = (term, tag2, reason = "") => {
  const yellow = (str) => "\x1B[33m\x1B[3m" + str + "\x1B[0m";
  const i2 = (str) => "\x1B[3m" + str + "\x1B[0m";
  let word = term.text || "[" + term.implicit + "]";
  if (typeof tag2 !== "string" && tag2.length > 2) {
    tag2 = tag2.slice(0, 2).join(", #") + " +";
  }
  tag2 = typeof tag2 !== "string" ? tag2.join(", #") : tag2;
  console.log(` ${yellow(word).padEnd(24)} \x1B[32m\u2192\x1B[0m #${tag2.padEnd(22)}  ${i2(reason)}`);
};
const setTag = function(term, tag2, reason) {
  if (!tag2 || tag2.length === 0) {
    return;
  }
  const env2 = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
  if (env2 && env2.DEBUG_TAGS) {
    log(term, tag2, reason);
  }
  term.tags = term.tags || /* @__PURE__ */ new Set();
  if (typeof tag2 === "string") {
    term.tags.add(tag2);
  } else {
    tag2.forEach((tg) => term.tags.add(tg));
  }
};
var fastTag = setTag;
const uncountable = [
  "Acronym",
  "Abbreviation",
  "ProperNoun",
  "Uncountable",
  "Possessive",
  "Pronoun",
  "Activity",
  "Honorific",
  "Month"
];
const setPluralSingular = function(term) {
  if (!term.tags.has("Noun") || term.tags.has("Plural") || term.tags.has("Singular")) {
    return;
  }
  if (uncountable.find((tag2) => term.tags.has(tag2))) {
    return;
  }
  if (looksPlural$1(term.normal)) {
    fastTag(term, "Plural", "3-plural-guess");
  } else {
    fastTag(term, "Singular", "3-singular-guess");
  }
};
const setTense = function(term) {
  let tags2 = term.tags;
  if (tags2.has("Verb") && tags2.size === 1) {
    let guess2 = getTense$2(term.normal);
    if (guess2) {
      fastTag(term, guess2, "3-verb-tense-guess");
    }
  }
};
const fillTags = function(terms, i2, model2) {
  let term = terms[i2];
  let tags2 = Array.from(term.tags);
  for (let k2 = 0; k2 < tags2.length; k2 += 1) {
    if (model2.one.tagSet[tags2[k2]]) {
      let toAdd = model2.one.tagSet[tags2[k2]].parents;
      fastTag(term, toAdd, ` -inferred by #${tags2[k2]}`);
    }
  }
  setPluralSingular(term);
  setTense(term);
};
var fillTags$1 = fillTags;
const titleCase$1 = /^\p{Lu}[\p{Ll}'’]/u;
const hasNumber = /[0-9]/;
const notProper = ["Date", "Month", "WeekDay", "Unit", "Expression"];
const hasIVX = /[IVX]/;
const romanNumeral = /^[IVXLCDM]{2,}$/;
const romanNumValid = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const nope = {
  li: true,
  dc: true,
  md: true,
  dm: true,
  ml: true
};
const checkCase = function(terms, i2, model2) {
  let term = terms[i2];
  term.index = term.index || [0, 0];
  let index2 = term.index[1];
  let str = term.text || "";
  if (index2 !== 0 && titleCase$1.test(str) === true && hasNumber.test(str) === false) {
    if (notProper.find((tag2) => term.tags.has(tag2))) {
      return null;
    }
    if (term.pre.match(/["']$/)) {
      return null;
    }
    if (term.normal === "the") {
      return null;
    }
    fillTags$1(terms, i2, model2);
    if (!term.tags.has("Noun")) {
      term.tags.clear();
    }
    fastTag(term, "ProperNoun", "2-titlecase");
    return true;
  }
  if (str.length >= 2 && romanNumeral.test(str) && hasIVX.test(str) && romanNumValid.test(str) && !nope[term.normal]) {
    fastTag(term, "RomanNumeral", "2-xvii");
    return true;
  }
  return null;
};
var checkCase$1 = checkCase;
const suffixLoop = function(str = "", suffixes2 = []) {
  const len = str.length;
  let max2 = 7;
  if (len <= max2) {
    max2 = len - 1;
  }
  for (let i2 = max2; i2 > 1; i2 -= 1) {
    let suffix = str.substring(len - i2, len);
    if (suffixes2[suffix.length].hasOwnProperty(suffix) === true) {
      let tag2 = suffixes2[suffix.length][suffix];
      return tag2;
    }
  }
  return null;
};
const tagBySuffix = function(terms, i2, model2) {
  let term = terms[i2];
  if (term.tags.size === 0) {
    let tag2 = suffixLoop(term.normal, model2.two.suffixPatterns);
    if (tag2 !== null) {
      fastTag(term, tag2, "2-suffix");
      term.confidence = 0.7;
      return true;
    }
    if (term.implicit) {
      tag2 = suffixLoop(term.implicit, model2.two.suffixPatterns);
      if (tag2 !== null) {
        fastTag(term, tag2, "2-implicit-suffix");
        term.confidence = 0.7;
        return true;
      }
    }
  }
  return null;
};
var checkSuffix = tagBySuffix;
const hasApostrophe = /['‘’‛‵′`´]/;
const doRegs = function(str, regs) {
  for (let i2 = 0; i2 < regs.length; i2 += 1) {
    if (regs[i2][0].test(str) === true) {
      return regs[i2];
    }
  }
  return null;
};
const doEndsWith = function(str = "", byEnd2) {
  let char = str[str.length - 1];
  if (byEnd2.hasOwnProperty(char) === true) {
    let regs = byEnd2[char] || [];
    for (let r2 = 0; r2 < regs.length; r2 += 1) {
      if (regs[r2][0].test(str) === true) {
        return regs[r2];
      }
    }
  }
  return null;
};
const checkRegex = function(terms, i2, model2, world2) {
  const setTag2 = world2.methods.one.setTag;
  let { regexText: regexText2, regexNormal: regexNormal2, regexNumbers: regexNumbers2, endsWith: endsWith2 } = model2.two;
  let term = terms[i2];
  let normal2 = term.machine || term.normal;
  let text2 = term.text;
  if (hasApostrophe.test(term.post) && !hasApostrophe.test(term.pre)) {
    text2 += term.post.trim();
  }
  let arr = doRegs(text2, regexText2) || doRegs(normal2, regexNormal2);
  if (!arr && /[0-9]/.test(normal2)) {
    arr = doRegs(normal2, regexNumbers2);
  }
  if (!arr && term.tags.size === 0) {
    arr = doEndsWith(normal2, endsWith2);
  }
  if (arr) {
    setTag2([term], arr[1], world2, null, `2-regex-'${arr[2] || arr[0]}'`);
    term.confidence = 0.6;
    return true;
  }
  return null;
};
var checkRegex$1 = checkRegex;
const prefixLoop = function(str = "", prefixes2 = []) {
  const len = str.length;
  let max2 = 7;
  if (max2 > len - 3) {
    max2 = len - 3;
  }
  for (let i2 = max2; i2 > 2; i2 -= 1) {
    let prefix2 = str.substring(0, i2);
    if (prefixes2[prefix2.length].hasOwnProperty(prefix2) === true) {
      let tag2 = prefixes2[prefix2.length][prefix2];
      return tag2;
    }
  }
  return null;
};
const checkPrefix = function(terms, i2, model2) {
  let term = terms[i2];
  if (term.tags.size === 0) {
    let tag2 = prefixLoop(term.normal, model2.two.prefixPatterns);
    if (tag2 !== null) {
      fastTag(term, tag2, "2-prefix");
      term.confidence = 0.5;
      return true;
    }
  }
  return null;
};
var checkPrefix$1 = checkPrefix;
const min = 1400;
const max = 2100;
const dateWords = /* @__PURE__ */ new Set([
  "in",
  "on",
  "by",
  "until",
  "for",
  "to",
  "during",
  "throughout",
  "through",
  "within",
  "before",
  "after",
  "of",
  "this",
  "next",
  "last",
  "circa",
  "around",
  "post",
  "pre",
  "budget",
  "classic",
  "plan",
  "may"
]);
const seemsGood = function(term) {
  if (!term) {
    return false;
  }
  let str = term.normal || term.implicit;
  if (dateWords.has(str)) {
    return true;
  }
  if (term.tags.has("Date") || term.tags.has("Month") || term.tags.has("WeekDay") || term.tags.has("Year")) {
    return true;
  }
  if (term.tags.has("ProperNoun")) {
    return true;
  }
  return false;
};
const seemsOkay = function(term) {
  if (!term) {
    return false;
  }
  if (term.tags.has("Ordinal")) {
    return true;
  }
  if (term.tags.has("Cardinal") && term.normal.length < 3) {
    return true;
  }
  if (term.normal === "is" || term.normal === "was") {
    return true;
  }
  return false;
};
const seemsFine = function(term) {
  return term && (term.tags.has("Date") || term.tags.has("Month") || term.tags.has("WeekDay") || term.tags.has("Year"));
};
const tagYear = function(terms, i2) {
  const term = terms[i2];
  if (term.tags.has("NumericValue") && term.tags.has("Cardinal") && term.normal.length === 4) {
    let num = Number(term.normal);
    if (num && !isNaN(num)) {
      if (num > min && num < max) {
        let lastTerm = terms[i2 - 1];
        let nextTerm = terms[i2 + 1];
        if (seemsGood(lastTerm) || seemsGood(nextTerm)) {
          return fastTag(term, "Year", "2-tagYear");
        }
        if (num >= 1920 && num < 2025) {
          if (seemsOkay(lastTerm) || seemsOkay(nextTerm)) {
            return fastTag(term, "Year", "2-tagYear-close");
          }
          if (seemsFine(terms[i2 - 2]) || seemsFine(terms[i2 + 2])) {
            return fastTag(term, "Year", "2-tagYear-far");
          }
          if (lastTerm && (lastTerm.tags.has("Determiner") || lastTerm.tags.has("Possessive"))) {
            if (nextTerm && nextTerm.tags.has("Noun") && !nextTerm.tags.has("Plural")) {
              return fastTag(term, "Year", "2-tagYear-noun");
            }
          }
        }
      }
    }
  }
  return null;
};
var checkYear = tagYear;
const verbType = function(terms, i2, model2, world2) {
  const setTag2 = world2.methods.one.setTag;
  const term = terms[i2];
  const types = ["PastTense", "PresentTense", "Auxiliary", "Modal", "Particle"];
  if (term.tags.has("Verb")) {
    let type = types.find((typ) => term.tags.has(typ));
    if (!type) {
      setTag2([term], "Infinitive", world2, null, `2-verb-type''`);
    }
  }
};
var verbType$1 = verbType;
const oneLetterAcronym = /^[A-Z]('s|,)?$/;
const isUpperCase = /^[A-Z-]+$/;
const upperThenS = /^[A-Z]+s$/;
const periodAcronym = /([A-Z]\.)+[A-Z]?,?$/;
const noPeriodAcronym = /[A-Z]{2,}('s|,)?$/;
const lowerCaseAcronym = /([a-z]\.)+[a-z]\.?$/;
const oneLetterWord = {
  I: true,
  A: true
};
const places$2 = {
  la: true,
  ny: true,
  us: true,
  dc: true,
  gb: true
};
const isNoPeriodAcronym = function(term, model2) {
  let str = term.text;
  if (isUpperCase.test(str) === false) {
    if (str.length > 3 && upperThenS.test(str) === true) {
      str = str.replace(/s$/, "");
    } else {
      return false;
    }
  }
  if (str.length > 5) {
    return false;
  }
  if (oneLetterWord.hasOwnProperty(str)) {
    return false;
  }
  if (model2.one.lexicon.hasOwnProperty(term.normal)) {
    return false;
  }
  if (periodAcronym.test(str) === true) {
    return true;
  }
  if (lowerCaseAcronym.test(str) === true) {
    return true;
  }
  if (oneLetterAcronym.test(str) === true) {
    return true;
  }
  if (noPeriodAcronym.test(str) === true) {
    return true;
  }
  return false;
};
const isAcronym = function(terms, i2, model2) {
  let term = terms[i2];
  if (term.tags.has("RomanNumeral") || term.tags.has("Acronym")) {
    return null;
  }
  if (isNoPeriodAcronym(term, model2)) {
    term.tags.clear();
    fastTag(term, ["Acronym", "Noun"], "3-no-period-acronym");
    if (places$2[term.normal] === true) {
      fastTag(term, "Place", "3-place-acronym");
    }
    if (upperThenS.test(term.text) === true) {
      fastTag(term, "Plural", "3-plural-acronym");
    }
    return true;
  }
  if (!oneLetterWord.hasOwnProperty(term.text) && oneLetterAcronym.test(term.text)) {
    term.tags.clear();
    fastTag(term, ["Acronym", "Noun"], "3-one-letter-acronym");
    return true;
  }
  if (term.tags.has("Organization") && term.text.length <= 3) {
    fastTag(term, "Acronym", "3-org-acronym");
    return true;
  }
  if (term.tags.has("Organization") && isUpperCase.test(term.text) && term.text.length <= 6) {
    fastTag(term, "Acronym", "3-titlecase-acronym");
    return true;
  }
  return null;
};
var checkAcronym = isAcronym;
const lookAtWord = function(term, words2) {
  if (!term) {
    return null;
  }
  let found = words2.find((a2) => term.normal === a2[0]);
  if (found) {
    return found[1];
  }
  return null;
};
const lookAtTag = function(term, tags2) {
  if (!term) {
    return null;
  }
  let found = tags2.find((a2) => term.tags.has(a2[0]));
  if (found) {
    return found[1];
  }
  return null;
};
const neighbours = function(terms, i2, model2) {
  const { leftTags, leftWords, rightWords, rightTags } = model2.two.neighbours;
  let term = terms[i2];
  if (term.tags.size === 0) {
    let tag2 = null;
    tag2 = tag2 || lookAtWord(terms[i2 - 1], leftWords);
    tag2 = tag2 || lookAtWord(terms[i2 + 1], rightWords);
    tag2 = tag2 || lookAtTag(terms[i2 - 1], leftTags);
    tag2 = tag2 || lookAtTag(terms[i2 + 1], rightTags);
    if (tag2) {
      fastTag(term, tag2, "3-[neighbour]");
      fillTags$1(terms, i2, model2);
      terms[i2].confidence = 0.2;
      return true;
    }
  }
  return null;
};
var neighbours$1 = neighbours;
const isTitleCase$1 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str);
const isOrg = function(term, i2, yelling) {
  if (!term) {
    return false;
  }
  if (term.tags.has("FirstName") || term.tags.has("Place")) {
    return false;
  }
  if (term.tags.has("ProperNoun") || term.tags.has("Organization") || term.tags.has("Acronym")) {
    return true;
  }
  if (!yelling && isTitleCase$1(term.text)) {
    if (i2 === 0) {
      return term.tags.has("Singular");
    }
    return true;
  }
  return false;
};
const tagOrgs = function(terms, i2, world2, yelling) {
  const orgWords2 = world2.model.two.orgWords;
  const setTag2 = world2.methods.one.setTag;
  let term = terms[i2];
  let str = term.machine || term.normal;
  if (orgWords2[str] === true && isOrg(terms[i2 - 1], i2 - 1, yelling)) {
    setTag2([terms[i2]], "Organization", world2, null, "3-[org-word]");
    for (let t2 = i2; t2 >= 0; t2 -= 1) {
      if (isOrg(terms[t2], t2, yelling)) {
        setTag2([terms[t2]], "Organization", world2, null, "3-[org-word]");
      } else {
        break;
      }
    }
  }
  return null;
};
var orgWords = tagOrgs;
const nounFallback = function(terms, i2, model2) {
  let isEmpty = false;
  let tags2 = terms[i2].tags;
  if (tags2.size === 0) {
    isEmpty = true;
  } else if (tags2.size === 1) {
    if (tags2.has("Hyphenated") || tags2.has("HashTag") || tags2.has("Prefix")) {
      isEmpty = true;
    }
  }
  if (isEmpty) {
    fastTag(terms[i2], "Noun", "3-[fallback]");
    fillTags$1(terms, i2, model2);
    terms[i2].confidence = 0.1;
  }
};
var nounFallback$1 = nounFallback;
const isTitleCase = /^[A-Z][a-z]/;
const isCapital = (terms, i2) => {
  if (terms[i2].tags.has("ProperNoun") && isTitleCase.test(terms[i2].text)) {
    return "Noun";
  }
  return null;
};
const isAlone = (terms, i2, tag2) => {
  if (i2 === 0 && !terms[1]) {
    return tag2;
  }
  return null;
};
const isEndNoun = function(terms, i2) {
  if (!terms[i2 + 1] && terms[i2 - 1] && terms[i2 - 1].tags.has("Determiner")) {
    return "Noun";
  }
  return null;
};
const isStart = function(terms, i2, tag2) {
  if (i2 === 0 && terms.length > 3) {
    return tag2;
  }
  return null;
};
const adhoc = {
  "Adj|Gerund": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Adj|Noun": (terms, i2) => {
    return isCapital(terms, i2) || isEndNoun(terms, i2);
  },
  "Actor|Verb": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Adj|Past": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Adj|Present": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Noun|Gerund": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Noun|Verb": (terms, i2) => {
    return i2 > 0 && isCapital(terms, i2) || isAlone(terms, i2, "Infinitive");
  },
  "Plural|Verb": (terms, i2) => {
    return isCapital(terms, i2) || isAlone(terms, i2, "PresentTense") || isStart(terms, i2, "Plural");
  },
  "Person|Noun": (terms, i2) => {
    return isCapital(terms, i2);
  },
  "Person|Verb": (terms, i2) => {
    if (i2 !== 0) {
      return isCapital(terms, i2);
    }
    return null;
  },
  "Person|Adj": (terms, i2) => {
    if (i2 === 0 && terms.length > 1) {
      return "Person";
    }
    return isCapital(terms, i2) ? "Person" : null;
  }
};
var adhoc$1 = adhoc;
const env = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
const prefix = /^(under|over|mis|re|un|dis|semi)-?/;
const checkWord = (term, obj) => {
  if (!term || !obj) {
    return null;
  }
  let str = term.normal || term.implicit;
  let found = null;
  if (obj.hasOwnProperty(str)) {
    found = obj[str];
  }
  if (found && env.DEBUG_TAGS) {
    console.log(`
  \x1B[2m\x1B[3m     \u2193 - '${str}' \x1B[0m`);
  }
  return found;
};
const checkTag = (term, obj = {}, tagSet) => {
  if (!term || !obj) {
    return null;
  }
  let tags2 = Array.from(term.tags).sort((a2, b) => {
    let numA = tagSet[a2] ? tagSet[a2].parents.length : 0;
    let numB = tagSet[b] ? tagSet[b].parents.length : 0;
    return numA > numB ? -1 : 1;
  });
  let found = tags2.find((tag2) => obj[tag2]);
  if (found && env.DEBUG_TAGS) {
    console.log(`  \x1B[2m\x1B[3m      \u2193 - '${term.normal || term.implicit}' (#${found})  \x1B[0m`);
  }
  found = obj[found];
  return found;
};
const pickTag = function(terms, i2, clues2, model2) {
  if (!clues2) {
    return null;
  }
  const tagSet = model2.one.tagSet;
  let tag2 = checkWord(terms[i2 + 1], clues2.afterWords);
  tag2 = tag2 || checkWord(terms[i2 - 1], clues2.beforeWords);
  tag2 = tag2 || checkTag(terms[i2 - 1], clues2.beforeTags, tagSet);
  tag2 = tag2 || checkTag(terms[i2 + 1], clues2.afterTags, tagSet);
  return tag2;
};
const doSwitches = function(terms, i2, world2) {
  const model2 = world2.model;
  const setTag2 = world2.methods.one.setTag;
  const { switches: switches2, clues: clues2 } = model2.two;
  const term = terms[i2];
  let str = term.normal || term.implicit || "";
  if (prefix.test(str) && !switches2[str]) {
    str = str.replace(prefix, "");
  }
  if (term.switch) {
    let form = term.switch;
    if (term.tags.has("Acronym") || term.tags.has("PhrasalVerb")) {
      return;
    }
    let tag2 = pickTag(terms, i2, clues2[form], model2);
    if (adhoc$1[form]) {
      tag2 = adhoc$1[form](terms, i2) || tag2;
    }
    if (tag2) {
      setTag2([term], tag2, world2, null, `3-[switch] (${form})`);
      fillTags$1(terms, i2, model2);
    } else if (env.DEBUG_TAGS) {
      console.log(`
 -> X  - '${str}'  : (${form})  `);
    }
  }
};
var switches = doSwitches;
const beside = {
  there: true,
  this: true,
  it: true,
  him: true,
  her: true,
  us: true
};
const imperative$1 = function(terms, world2) {
  const setTag2 = world2.methods.one.setTag;
  const multiWords = world2.model.one._multiCache || {};
  let t2 = terms[0];
  let isRight = t2.switch === "Noun|Verb" || t2.tags.has("Infinitive");
  if (isRight && terms.length >= 2) {
    if (terms.length < 4 && !beside[terms[1].normal]) {
      return;
    }
    if (!t2.tags.has("PhrasalVerb") && multiWords.hasOwnProperty(t2.normal)) {
      return;
    }
    let nextNoun = terms[1].tags.has("Noun") || terms[1].tags.has("Determiner");
    if (nextNoun) {
      let soonVerb = terms.slice(1, 3).some((term) => term.tags.has("Verb"));
      if (!soonVerb || t2.tags.has("#PhrasalVerb")) {
        setTag2([t2], "Imperative", world2, null, "3-[imperative]");
      }
    }
  }
};
var imperative$2 = imperative$1;
const ignoreCase = function(terms) {
  if (terms.filter((t2) => !t2.tags.has("ProperNoun")).length <= 3) {
    return false;
  }
  const lowerCase = /^[a-z]/;
  return terms.every((t2) => !lowerCase.test(t2.text));
};
const firstPass = function(docs, model2, world2) {
  docs.forEach((terms) => {
    colons(terms, 0, model2, world2);
  });
};
const secondPass = function(terms, model2, world2, isYelling) {
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    tagSwitch$1(terms, i2, model2);
    if (isYelling === false) {
      checkCase$1(terms, i2, model2);
    }
    checkSuffix(terms, i2, model2);
    checkRegex$1(terms, i2, model2, world2);
    checkPrefix$1(terms, i2, model2);
    checkYear(terms, i2);
  }
};
const thirdPass = function(terms, model2, world2, isYelling) {
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    let found = checkAcronym(terms, i2, model2);
    fillTags$1(terms, i2, model2);
    found = found || neighbours$1(terms, i2, model2);
    found = found || nounFallback$1(terms, i2, model2);
  }
  for (let i2 = 0; i2 < terms.length; i2 += 1) {
    orgWords(terms, i2, world2, isYelling);
    switches(terms, i2, world2);
    verbType$1(terms, i2, model2, world2);
    hyphens(terms, i2, model2, world2);
  }
  imperative$2(terms, world2);
};
const preTagger = function(view) {
  const { methods: methods2, model: model2, world: world2 } = view;
  let docs = view.docs;
  firstPass(docs, model2, world2);
  let document2 = methods2.two.quickSplit(docs);
  for (let n2 = 0; n2 < document2.length; n2 += 1) {
    let terms = document2[n2];
    const isYelling = ignoreCase(terms);
    secondPass(terms, model2, world2, isYelling);
    thirdPass(terms, model2, world2, isYelling);
  }
  return document2;
};
var preTagger$1 = preTagger;
const toRoot$2 = {
  "Possessive": (term) => {
    let str = term.machine || term.normal || term.text;
    str = str.replace(/'s$/, "");
    return str;
  },
  "Plural": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    return world2.methods.two.transform.noun.toSingular(str, world2.model);
  },
  "Copula": () => {
    return "is";
  },
  "PastTense": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    return world2.methods.two.transform.verb.toInfinitive(str, world2.model, "PastTense");
  },
  "Gerund": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    return world2.methods.two.transform.verb.toInfinitive(str, world2.model, "Gerund");
  },
  "PresentTense": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    if (term.tags.has("Infinitive")) {
      return str;
    }
    return world2.methods.two.transform.verb.toInfinitive(str, world2.model, "PresentTense");
  },
  "Comparative": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    return world2.methods.two.transform.adjective.fromComparative(str, world2.model);
  },
  "Superlative": (term, world2) => {
    let str = term.machine || term.normal || term.text;
    return world2.methods.two.transform.adjective.fromSuperlative(str, world2.model);
  },
  "Adverb": (term, world2) => {
    const { fromAdverb: fromAdverb2 } = world2.methods.two.transform.adjective;
    let str = term.machine || term.normal || term.text;
    return fromAdverb2(str);
  }
};
const getRoot$2 = function(view) {
  const world2 = view.world;
  const keys = Object.keys(toRoot$2);
  view.docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      const term = terms[i2];
      for (let k2 = 0; k2 < keys.length; k2 += 1) {
        if (term.tags.has(keys[k2])) {
          const fn = toRoot$2[keys[k2]];
          let root2 = fn(term, world2);
          if (term.normal !== root2) {
            term.root = root2;
          }
          break;
        }
      }
    }
  });
};
var root = getRoot$2;
const mapping$1 = {
  "Adverb": "RB",
  "Comparative": "JJR",
  "Superlative": "JJS",
  "Adjective": "JJ",
  "TO": "Conjunction",
  "Modal": "MD",
  "Auxiliary": "MD",
  "Gerund": "VBG",
  "PastTense": "VBD",
  "Participle": "VBN",
  "PresentTense": "VBZ",
  "Infinitive": "VB",
  "Particle": "RP",
  "Verb": "VB",
  "Pronoun": "PRP",
  "Cardinal": "CD",
  "Conjunction": "CC",
  "Determiner": "DT",
  "Preposition": "IN",
  "QuestionWord": "WP",
  "Expression": "UH",
  "Possessive": "POS",
  "ProperNoun": "NNP",
  "Person": "NNP",
  "Place": "NNP",
  "Organization": "NNP",
  "Singular": "NNP",
  "Plural": "NNS",
  "Noun": "NN",
  "There": "EX"
};
const toPenn = function(term) {
  if (term.tags.has("ProperNoun") && term.tags.has("Plural")) {
    return "NNPS";
  }
  if (term.tags.has("Possessive") && term.tags.has("Pronoun")) {
    return "PRP$";
  }
  if (term.normal === "there") {
    return "EX";
  }
  if (term.normal === "to") {
    return "TO";
  }
  let arr = term.tagRank || [];
  for (let i2 = 0; i2 < arr.length; i2 += 1) {
    if (mapping$1.hasOwnProperty(arr[i2])) {
      return mapping$1[arr[i2]];
    }
  }
  return null;
};
const pennTag = function(view) {
  view.compute("tagRank");
  view.docs.forEach((terms) => {
    terms.forEach((term) => {
      term.penn = toPenn(term);
    });
  });
};
var penn = pennTag;
var compute$4 = { preTagger: preTagger$1, root, penn };
const entity = ["Person", "Place", "Organization"];
var nouns$1 = {
  Noun: {
    not: ["Verb", "Adjective", "Adverb", "Value", "Determiner"]
  },
  Singular: {
    is: "Noun",
    not: ["Plural", "Uncountable"]
  },
  ProperNoun: {
    is: "Noun"
  },
  Person: {
    is: "Singular",
    also: ["ProperNoun"],
    not: ["Place", "Organization", "Date"]
  },
  FirstName: {
    is: "Person"
  },
  MaleName: {
    is: "FirstName",
    not: ["FemaleName", "LastName"]
  },
  FemaleName: {
    is: "FirstName",
    not: ["MaleName", "LastName"]
  },
  LastName: {
    is: "Person",
    not: ["FirstName"]
  },
  Honorific: {
    is: "Person",
    not: ["FirstName", "LastName", "Value"]
  },
  Place: {
    is: "Singular",
    not: ["Person", "Organization"]
  },
  Country: {
    is: "Place",
    also: ["ProperNoun"],
    not: ["City"]
  },
  City: {
    is: "Place",
    also: ["ProperNoun"],
    not: ["Country"]
  },
  Region: {
    is: "Place",
    also: ["ProperNoun"]
  },
  Address: {},
  Organization: {
    is: "ProperNoun",
    not: ["Person", "Place"]
  },
  SportsTeam: {
    is: "Organization"
  },
  School: {
    is: "Organization"
  },
  Company: {
    is: "Organization"
  },
  Plural: {
    is: "Noun",
    not: ["Singular", "Uncountable"]
  },
  Uncountable: {
    is: "Noun"
  },
  Pronoun: {
    is: "Noun",
    not: entity
  },
  Actor: {
    is: "Noun",
    not: ["Place", "Organization"]
  },
  Activity: {
    is: "Noun",
    not: ["Person", "Place"]
  },
  Unit: {
    is: "Noun",
    not: entity
  },
  Demonym: {
    is: "Noun",
    also: ["ProperNoun"],
    not: entity
  },
  Possessive: {
    is: "Noun"
  },
  Reflexive: {
    is: "Pronoun"
  }
};
var verbs$2 = {
  Verb: {
    not: ["Noun", "Adjective", "Adverb", "Value", "Expression"]
  },
  PresentTense: {
    is: "Verb",
    not: ["PastTense"]
  },
  Infinitive: {
    is: "PresentTense",
    not: ["Gerund"]
  },
  Imperative: {
    is: "Verb",
    not: ["PastTense", "Gerund", "Copula"]
  },
  Gerund: {
    is: "PresentTense",
    not: ["Copula"]
  },
  PastTense: {
    is: "Verb",
    not: ["PresentTense", "Gerund"]
  },
  Copula: {
    is: "Verb"
  },
  Modal: {
    is: "Verb",
    not: ["Infinitive"]
  },
  Participle: {
    is: "PastTense"
  },
  Auxiliary: {
    is: "Verb",
    not: ["PastTense", "PresentTense", "Gerund", "Conjunction"]
  },
  PhrasalVerb: {
    is: "Verb"
  },
  Particle: {
    is: "PhrasalVerb",
    not: ["PastTense", "PresentTense", "Copula", "Gerund"]
  },
  Passive: {
    is: "Verb"
  }
};
var values = {
  Value: {
    not: ["Verb", "Adjective", "Adverb"]
  },
  Ordinal: {
    is: "Value",
    not: ["Cardinal"]
  },
  Cardinal: {
    is: "Value",
    not: ["Ordinal"]
  },
  Fraction: {
    is: "Value",
    not: ["Noun"]
  },
  Multiple: {
    is: "TextValue"
  },
  RomanNumeral: {
    is: "Cardinal",
    not: ["TextValue"]
  },
  TextValue: {
    is: "Value",
    not: ["NumericValue"]
  },
  NumericValue: {
    is: "Value",
    not: ["TextValue"]
  },
  Money: {
    is: "Cardinal"
  },
  Percent: {
    is: "Value"
  }
};
var dates$1 = {
  Date: {
    not: ["Verb", "Adverb", "Adjective"]
  },
  Month: {
    is: "Date",
    also: ["Noun"],
    not: ["Year", "WeekDay", "Time"]
  },
  WeekDay: {
    is: "Date",
    also: ["Noun"]
  },
  Year: {
    is: "Date",
    not: ["RomanNumeral"]
  },
  FinancialQuarter: {
    is: "Date",
    not: "Fraction"
  },
  Holiday: {
    is: "Date",
    also: ["Noun"]
  },
  Season: {
    is: "Date"
  },
  Timezone: {
    is: "Date",
    also: ["Noun"],
    not: ["ProperNoun"]
  },
  Time: {
    is: "Date",
    not: ["AtMention"]
  },
  Duration: {
    is: "Date",
    also: ["Noun"]
  }
};
const anything = ["Noun", "Verb", "Adjective", "Adverb", "Value", "QuestionWord"];
var misc$2 = {
  Adjective: {
    not: ["Noun", "Verb", "Adverb", "Value"]
  },
  Comparable: {
    is: "Adjective"
  },
  Comparative: {
    is: "Adjective"
  },
  Superlative: {
    is: "Adjective",
    not: ["Comparative"]
  },
  NumberRange: {},
  Adverb: {
    not: ["Noun", "Verb", "Adjective", "Value"]
  },
  Determiner: {
    not: ["Noun", "Verb", "Adjective", "Adverb", "QuestionWord", "Conjunction"]
  },
  Conjunction: {
    not: anything
  },
  Preposition: {
    not: ["Noun", "Verb", "Adjective", "Adverb", "QuestionWord", "Determiner"]
  },
  QuestionWord: {
    not: ["Determiner"]
  },
  Currency: {
    is: "Noun"
  },
  Expression: {
    not: ["Noun", "Adjective", "Verb", "Adverb"]
  },
  Abbreviation: {},
  Url: {
    not: ["HashTag", "PhoneNumber", "Verb", "Adjective", "Value", "AtMention", "Email"]
  },
  PhoneNumber: {
    not: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "Email"]
  },
  HashTag: {},
  AtMention: {
    is: "Noun",
    not: ["HashTag", "Email"]
  },
  Emoji: {
    not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]
  },
  Emoticon: {
    not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]
  },
  Email: {
    not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]
  },
  Acronym: {
    not: ["Plural", "RomanNumeral", "Pronoun"]
  },
  Negative: {
    not: ["Noun", "Adjective", "Value", "Expression"]
  },
  Condition: {
    not: ["Verb", "Adjective", "Noun", "Value"]
  },
  There: {
    not: ["Verb", "Adjective", "Noun", "Value", "Conjunction", "Preposition"]
  },
  Prefix: {
    not: ["Abbreviation", "Acronym", "ProperNoun"]
  },
  Hyphenated: {}
};
let allTags = Object.assign({}, nouns$1, verbs$2, values, dates$1, misc$2);
var tags = allTags;
var preTag = {
  compute: compute$4,
  methods: methods$1,
  model: model$2,
  tags,
  hooks: ["preTagger"]
};
const postPunct = /[,)"';:\-–—.…]/;
const setContraction = function(m2, suffix) {
  if (!m2.found) {
    return;
  }
  let terms = m2.termList();
  for (let i2 = 0; i2 < terms.length - 1; i2++) {
    const t2 = terms[i2];
    if (postPunct.test(t2.post)) {
      return;
    }
  }
  terms[0].implicit = terms[0].normal;
  terms[0].text += suffix;
  terms[0].normal += suffix;
  terms.slice(1).forEach((t2) => {
    t2.implicit = t2.normal;
    t2.text = "";
    t2.normal = "";
  });
  for (let i2 = 0; i2 < terms.length - 1; i2++) {
    terms[i2].post = terms[i2].post.replace(/ /, "");
  }
};
const contract = function() {
  let doc = this.not("@hasContraction");
  let m2 = doc.match("(we|they|you) are");
  setContraction(m2, `'re`);
  m2 = doc.match("(he|she|they|it|we|you) will");
  setContraction(m2, `'ll`);
  m2 = doc.match("(he|she|they|it|we) is");
  setContraction(m2, `'s`);
  m2 = doc.match("#Person is");
  setContraction(m2, `'s`);
  m2 = doc.match("#Person would");
  setContraction(m2, `'d`);
  m2 = doc.match("(is|was|had|would|should|could|do|does|have|has|can) not");
  setContraction(m2, `n't`);
  m2 = doc.match("(i|we|they) have");
  setContraction(m2, `'ve`);
  m2 = doc.match("(would|should|could) have");
  setContraction(m2, `'ve`);
  m2 = doc.match("i am");
  setContraction(m2, `'m`);
  m2 = doc.match("going to");
  return this;
};
var contract$1 = contract;
const titleCase = /^\p{Lu}[\p{Ll}'’]/u;
const toTitleCase = function(str = "") {
  str = str.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
  return str;
};
const api$p = function(View2) {
  class Contractions extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Contraction";
    }
    expand() {
      this.docs.forEach((terms) => {
        let isTitleCase2 = titleCase.test(terms[0].text);
        terms.forEach((t2, i2) => {
          t2.text = t2.implicit || "";
          delete t2.implicit;
          if (i2 < terms.length - 1 && t2.post === "") {
            t2.post += " ";
          }
          t2.dirty = true;
        });
        if (isTitleCase2) {
          terms[0].text = toTitleCase(terms[0].text);
        }
      });
      this.compute("normal");
      return this;
    }
  }
  View2.prototype.contractions = function() {
    let m2 = this.match("@hasContraction+");
    return new Contractions(this.document, m2.pointer);
  };
  View2.prototype.contract = contract$1;
};
var api$q = api$p;
const insertContraction = function(document2, point, words2) {
  let [n2, w] = point;
  if (!words2 || words2.length === 0) {
    return;
  }
  words2 = words2.map((word, i2) => {
    word.implicit = word.text;
    word.machine = word.text;
    word.pre = "";
    word.post = "";
    word.text = "";
    word.normal = "";
    word.index = [n2, w + i2];
    return word;
  });
  if (words2[0]) {
    words2[0].pre = document2[n2][w].pre;
    words2[words2.length - 1].post = document2[n2][w].post;
    words2[0].text = document2[n2][w].text;
    words2[0].normal = document2[n2][w].normal;
  }
  document2[n2].splice(w, 1, ...words2);
};
var splice = insertContraction;
const hasContraction$1 = /'/;
const isHas = (terms, i2) => {
  let after2 = terms.slice(i2 + 1, i2 + 3);
  return after2.some((t2) => t2.tags.has("PastTense"));
};
const apostropheS$1 = function(terms, i2) {
  let before2 = terms[i2].normal.split(hasContraction$1)[0];
  if (isHas(terms, i2)) {
    return [before2, "has"];
  }
  if (before2 === "let") {
    return [before2, "us"];
  }
  if (before2 === "there") {
    let nextTerm = terms[i2 + 1];
    if (nextTerm && nextTerm.tags.has("Plural")) {
      return [before2, "are"];
    }
  }
  return [before2, "is"];
};
var apostropheS$2 = apostropheS$1;
const hasContraction = /'/;
const pickHad = (terms, i2) => {
  if (terms[i2 + 1] && terms[i2 + 1].normal == "better") {
    return true;
  }
  let after2 = terms.slice(i2 + 1, i2 + 3);
  return after2.some((t2) => t2.tags.has("PastTense"));
};
const _apostropheD = function(terms, i2) {
  let before2 = terms[i2].normal.split(hasContraction)[0];
  if (before2 === "how" || before2 === "what") {
    return [before2, "did"];
  }
  if (pickHad(terms, i2) === true) {
    return [before2, "had"];
  }
  return [before2, "would"];
};
var apostropheD = _apostropheD;
const lastNoun$1 = function(terms, i2) {
  for (let n2 = i2 - 1; n2 >= 0; n2 -= 1) {
    if (terms[n2].tags.has("Noun") || terms[n2].tags.has("Pronoun") || terms[n2].tags.has("Plural") || terms[n2].tags.has("Singular")) {
      return terms[n2];
    }
  }
  return null;
};
const apostropheT = function(terms, i2) {
  if (terms[i2].normal === "ain't" || terms[i2].normal === "aint") {
    if (terms[i2 + 1] && terms[i2 + 1].normal === "never") {
      return ["have"];
    }
    let noun2 = lastNoun$1(terms, i2);
    if (noun2) {
      if (noun2.normal === "we" || noun2.normal === "they") {
        return ["are", "not"];
      }
      if (noun2.normal === "i") {
        return ["am", "not"];
      }
      if (noun2.tags && noun2.tags.has("Plural")) {
        return ["are", "not"];
      }
    }
    return ["is", "not"];
  }
  let before2 = terms[i2].normal.replace(/n't/, "");
  return [before2, "not"];
};
var apostropheT$1 = apostropheT;
const banList = {
  that: true,
  there: true,
  let: true,
  here: true,
  everywhere: true
};
const beforePossessive = {
  in: true,
  by: true,
  for: true
};
const isPossessive = (terms, i2) => {
  let term = terms[i2];
  if (banList.hasOwnProperty(term.machine || term.normal)) {
    return false;
  }
  if (term.tags.has("Possessive")) {
    return true;
  }
  if (term.tags.has("QuestionWord")) {
    return false;
  }
  if (term.normal === `he's` || term.normal === `she's`) {
    return false;
  }
  let nextTerm = terms[i2 + 1];
  if (!nextTerm) {
    return true;
  }
  if (term.normal === `it's`) {
    if (nextTerm.tags.has("#Noun")) {
      return true;
    }
    return false;
  }
  if (nextTerm.tags.has("Verb")) {
    if (nextTerm.tags.has("Infinitive")) {
      return true;
    }
    if (nextTerm.tags.has("PresentTense")) {
      return true;
    }
    return false;
  }
  if (nextTerm.tags.has("Noun")) {
    let nextStr = nextTerm.machine || nextTerm.normal;
    if (nextStr === "here" || nextStr === "there" || nextStr === "everywhere") {
      return false;
    }
    if (nextTerm.tags.has("Possessive")) {
      return false;
    }
    if (nextTerm.tags.has("ProperNoun") && !term.tags.has("ProperNoun")) {
      return false;
    }
    return true;
  }
  if (terms[i2 - 1] && beforePossessive[terms[i2 - 1].normal] === true) {
    return true;
  }
  let twoTerm = terms[i2 + 2];
  if (twoTerm && twoTerm.tags.has("Noun") && !twoTerm.tags.has("Pronoun")) {
    return true;
  }
  if (nextTerm.tags.has("Adjective") || nextTerm.tags.has("Adverb") || nextTerm.tags.has("Verb")) {
    return false;
  }
  return false;
};
var isPossessive$1 = isPossessive;
const byApostrophe = /'/;
const reIndex = function(terms) {
  terms.forEach((t2, i2) => {
    if (t2.index) {
      t2.index[1] = i2;
    }
  });
};
const reTag = function(terms, view, start2, len) {
  let tmp = view.update();
  tmp.document = [terms];
  let end2 = start2 + len;
  if (start2 > 0) {
    start2 -= 1;
  }
  if (terms[end2]) {
    end2 += 1;
  }
  tmp.ptrs = [[0, start2, end2]];
  tmp.compute(["lexicon", "preTagger"]);
  reIndex(terms);
};
const byEnd = {
  d: (terms, i2) => apostropheD(terms, i2),
  t: (terms, i2) => apostropheT$1(terms, i2),
  s: (terms, i2, world2) => {
    if (isPossessive$1(terms, i2)) {
      return world2.methods.one.setTag([terms[i2]], "Possessive", world2, "2-contraction");
    }
    return apostropheS$2(terms, i2);
  }
};
const toDocs = function(words2, view) {
  let doc = view.fromText(words2.join(" "));
  doc.compute("id");
  return doc.docs[0];
};
const contractionTwo$1 = (view) => {
  let { world: world2, document: document2 } = view;
  document2.forEach((terms, n2) => {
    for (let i2 = terms.length - 1; i2 >= 0; i2 -= 1) {
      if (terms[i2].implicit) {
        return;
      }
      let after2 = null;
      if (byApostrophe.test(terms[i2].normal) === true) {
        [, after2] = terms[i2].normal.split(byApostrophe);
      }
      let words2 = null;
      if (byEnd.hasOwnProperty(after2)) {
        words2 = byEnd[after2](terms, i2, world2);
      }
      if (words2) {
        words2 = toDocs(words2, view);
        splice(document2, [n2, i2], words2);
        reTag(document2[n2], view, i2, words2.length);
        continue;
      }
    }
  });
};
var compute$3 = { contractionTwo: contractionTwo$1 };
var contractionTwo = {
  compute: compute$3,
  api: api$q,
  hooks: ["contractionTwo"]
};
var adj = [
  { match: "[(all|both)] #Determiner #Noun", group: 0, tag: "Noun", reason: "all-noun" },
  { match: "#Copula [(just|alone)]$", group: 0, tag: "Adjective", reason: "not-adverb" },
  { match: "#Singular is #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "is-filled" },
  { match: "[#PastTense] #Singular is", group: 0, tag: "Adjective", reason: "smoked-poutine" },
  { match: "[#PastTense] #Plural are", group: 0, tag: "Adjective", reason: "baked-onions" },
  { match: "well [#PastTense]", group: 0, tag: "Adjective", reason: "well-made" },
  { match: "#Copula [fucked up?]", group: 0, tag: "Adjective", reason: "swears-adjective" },
  { match: "#Singular (seems|appears) #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "seems-filled" },
  { match: "#Copula #Adjective? [(out|in|through)]$", group: 0, tag: "Adjective", reason: "still-out" },
  { match: "^[#Adjective] (the|your) #Noun", group: 0, notIf: "(all|even)", tag: "Infinitive", reason: "shut-the" },
  { match: "the [said] #Noun", group: 0, tag: "Adjective", reason: "the-said-card" },
  { match: "[#Hyphenated (#Hyphenated && #PastTense)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", notIf: "#Adverb", reason: "faith-based" },
  { match: "[#Hyphenated (#Hyphenated && #Gerund)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", notIf: "#Adverb", reason: "self-driving" },
  { match: "[#PastTense (#Hyphenated && #PhrasalVerb)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", reason: "dammed-up" },
  { match: "(#Hyphenated && #Value) fold", tag: "Adjective", reason: "two-fold" },
  { match: "must (#Hyphenated && #Infinitive)", tag: "Adjective", reason: "must-win" },
  { match: `(#Hyphenated && #Infinitive) #Hyphenated`, tag: "Adjective", notIf: "#PhrasalVerb", reason: "vacuum-sealed" },
  { match: "too much", tag: "Adverb Adjective", reason: "bit-4" },
  { match: "a bit much", tag: "Determiner Adverb Adjective", reason: "bit-3" },
  { match: "[(un|contra|extra|inter|intra|macro|micro|mid|mis|mono|multi|pre|sub|tri|ex)] #Adjective", group: 0, tag: ["Adjective", "Prefix"], reason: "un-skilled" }
];
const adverbAdj = `(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)`;
const noLy = "(hard|fast|late|early|high|right|deep|close|direct)";
var advAdj = [
  { match: `#Adverb [#Adverb] (and|or|then)`, group: 0, tag: "Adjective", reason: "kinda-sparkly-and" },
  { match: `[${adverbAdj}] #Adjective`, group: 0, tag: "Adverb", reason: "dark-green" },
  { match: `#Copula [far too] #Adjective`, group: 0, tag: "Adverb", reason: "far-too" },
  { match: `#Copula [still] (in|#Gerund|#Adjective)`, group: 0, tag: "Adverb", reason: "was-still-walking" },
  { match: `#Plural ${noLy}`, tag: "#PresentTense #Adverb", reason: "studies-hard" },
  { match: `#Verb [${noLy}] !#Noun?`, group: 0, notIf: "(#Copula|get|got|getting|become|became|becoming|feel|feels|feeling)", tag: "Adverb", reason: "shops-direct" },
  { match: `[#Plural] a lot`, tag: "PresentTense", reason: "studies-a-lot" }
];
var gerundAdj = [
  { match: "as [#Gerund] as", group: 0, tag: "Adjective", reason: "as-gerund-as" },
  { match: "more [#Gerund] than", group: 0, tag: "Adjective", reason: "more-gerund-than" },
  { match: "(so|very|extremely) [#Gerund]", group: 0, tag: "Adjective", reason: "so-gerund" },
  { match: "(found|found) it #Adverb? [#Gerund]", group: 0, tag: "Adjective", reason: "found-it-gerund" },
  { match: "a (little|bit|wee) bit? [#Gerund]", group: 0, tag: "Adjective", reason: "a-bit-gerund" },
  { match: "#Gerund [#Gerund]", group: 0, tag: "Adjective", notIf: "(impersonating|practicing|considering|assuming)", reason: "looking-annoying" },
  { match: "(looked|look|looks) #Adverb? [%Adj|Gerund%]", group: 0, tag: "Adjective", notIf: "(impersonating|practicing|considering|assuming)", reason: "looked-amazing" },
  { match: "[%Adj|Gerund%] #Determiner", group: 0, tag: "Gerund", reason: "developing-a" },
  { match: "#Possessive [%Adj|Gerund%] #Noun", group: 0, tag: "Adjective", reason: "leading-manufacturer" }
];
var nounAdj = [
  { match: "#Determiner [#Adjective] #Copula", group: 0, tag: "Noun", reason: "the-adj-is" },
  { match: "#Adjective [#Adjective] #Copula", group: 0, tag: "Noun", reason: "adj-adj-is" },
  { match: "(his|its) [%Adj|Noun%]", group: 0, tag: "Noun", notIf: "#Hyphenated", reason: "his-fine" },
  { match: "#Copula #Adverb? [all]", group: 0, tag: "Noun", reason: "is-all" },
  { match: `(have|had) [#Adjective] #Preposition .`, group: 0, tag: "Noun", reason: "have-fun" },
  { match: `#Gerund (giant|capital|center|zone|application)`, tag: "Noun", reason: "brewing-giant" },
  { match: `#Preposition (a|an) [#Adjective]$`, group: 0, tag: "Noun", reason: "an-instant" },
  { match: `no [#Adjective] #Modal`, group: 0, tag: "Noun", reason: "no-golden" },
  { match: `[brand #Gerund?] new`, group: 0, tag: "Adverb", reason: "brand-new" },
  { match: `(#Determiner|#Comparative|new|different) [kind]`, group: 0, tag: "Noun", reason: "some-kind" },
  { match: `#Possessive [%Adj|Noun%] #Noun`, group: 0, tag: "Adjective", reason: "her-favourite" },
  { match: `must && #Hyphenated .`, tag: "Adjective", reason: "must-win" },
  { match: `#Determiner [#Adjective]$`, tag: "Noun", notIf: "(this|that|#Comparative|#Superlative)", reason: "the-south" },
  { match: `(#Noun && #Hyphenated) (#Adjective && #Hyphenated)`, tag: "Adjective", notIf: "(this|that|#Comparative|#Superlative)", reason: "company-wide" },
  { match: `#Determiner [#Adjective] (#Copula|#Determiner)`, notIf: "(#Comparative|#Superlative)", group: 0, tag: "Noun", reason: "the-poor" }
];
var adjVerb = [
  { match: "(slowly|quickly) [#Adjective]", group: 0, tag: "Verb", reason: "slowly-adj" },
  { match: "does (#Adverb|not)? [#Adjective]", group: 0, tag: "PresentTense", reason: "does-mean" },
  { match: "[(fine|okay|cool|ok)] by me", group: 0, tag: "Adjective", reason: "okay-by-me" },
  { match: "i (#Adverb|do)? not? [mean]", group: 0, tag: "PresentTense", reason: "i-mean" },
  { match: "will #Adjective", tag: "Auxiliary Infinitive", reason: "will-adj" },
  { match: "#Pronoun [#Adjective] #Determiner #Adjective? #Noun", group: 0, tag: "Verb", reason: "he-adj-the" },
  { match: "#Copula [%Adj|Present%] to #Verb", group: 0, tag: "Verb", reason: "adj-to" },
  { match: "#Copula [#Adjective] (well|badly|quickly|slowly)", group: 0, tag: "Verb", reason: "done-well" },
  { match: "#Adjective and [#Gerund] !#Preposition?", group: 0, tag: "Adjective", reason: "rude-and-x" },
  { match: "#Copula #Adverb? (over|under) [#PastTense]", group: 0, tag: "Adjective", reason: "over-cooked" },
  { match: "#Copula #Adjective+ (and|or) [#PastTense]$", group: 0, tag: "Adjective", reason: "bland-and-overcooked" },
  { match: "got #Adverb? [#PastTense] of", group: 0, tag: "Adjective", reason: "got-tired-of" },
  { match: "(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]", group: 0, tag: "Adjective", reason: "felt-loved" },
  { match: "(seem|feel|seemed|felt) [#PastTense #Particle?]", group: 0, tag: "Adjective", reason: "seem-confused" },
  { match: "a (bit|little|tad) [#PastTense #Particle?]", group: 0, tag: "Adjective", reason: "a-bit-confused" },
  { match: "not be [%Adj|Past% #Particle?]", group: 0, tag: "Adjective", reason: "do-not-be-confused" },
  { match: "#Copula just [%Adj|Past% #Particle?]", group: 0, tag: "Adjective", reason: "is-just-right" },
  { match: "as [#Infinitive] as", group: 0, tag: "Adjective", reason: "as-pale-as" },
  { match: "[%Adj|Past%] and #Adjective", group: 0, tag: "Adjective", reason: "faled-and-oppressive" },
  { match: "or [#PastTense] #Noun", group: 0, tag: "Adjective", notIf: "(#Copula|#Pronoun)", reason: "or-heightened-emotion" },
  { match: "(become|became|becoming|becomes) [#Verb]", group: 0, tag: "Adjective", reason: "become-verb" },
  { match: "#Possessive [#PastTense] #Noun", group: 0, tag: "Adjective", reason: "declared-intentions" },
  { match: "#Copula #Pronoun [%Adj|Present%]", group: 0, tag: "Adjective", reason: "is-he-cool" }
];
var adv = [
  { match: "[still] #Adjective", group: 0, tag: "Adverb", reason: "still-advb" },
  { match: "[still] #Verb", group: 0, tag: "Adverb", reason: "still-verb" },
  { match: "[so] #Adjective", group: 0, tag: "Adverb", reason: "so-adv" },
  { match: "[way] #Comparative", group: 0, tag: "Adverb", reason: "way-adj" },
  { match: "[way] #Adverb #Adjective", group: 0, tag: "Adverb", reason: "way-too-adj" },
  { match: "[all] #Verb", group: 0, tag: "Adverb", reason: "all-verb" },
  { match: "#Verb  [like]", group: 0, notIf: "(#Modal|#PhrasalVerb)", tag: "Adverb", reason: "verb-like" },
  { match: "(barely|hardly) even", tag: "Adverb", reason: "barely-even" },
  { match: "[even] #Verb", group: 0, tag: "Adverb", reason: "even-walk" },
  { match: "[even] #Comparative", group: 0, tag: "Adverb", reason: "even-worse" },
  { match: "[even] (#Determiner|#Possessive)", group: 0, tag: "#Adverb", reason: "even-the" },
  { match: "even left", tag: "#Adverb #Verb", reason: "even-left" },
  { match: "[way] #Adjective", group: 0, tag: "#Adverb", reason: "way-over" },
  {
    match: "#PresentTense [(hard|quick|bright|slow|fast|backwards|forwards)]",
    notIf: "#Copula",
    group: 0,
    tag: "Adverb",
    reason: "lazy-ly"
  },
  { match: "[much] #Adjective", group: 0, tag: "Adverb", reason: "bit-1" },
  { match: "#Copula [#Adverb]$", group: 0, tag: "Adjective", reason: "is-well" },
  { match: "a [(little|bit|wee) bit?] #Adjective", group: 0, tag: "Adverb", reason: "a-bit-cold" },
  { match: `[(super|pretty)] #Adjective`, group: 0, tag: "Adverb", reason: "super-strong" },
  { match: "(become|fall|grow) #Adverb? [#PastTense]", group: 0, tag: "Adjective", reason: "overly-weakened" },
  { match: "(a|an) #Adverb [#Participle] #Noun", group: 0, tag: "Adjective", reason: "completely-beaten" },
  { match: "#Determiner #Adverb? [close]", group: 0, tag: "Adjective", reason: "a-close" },
  { match: "#Gerund #Adverb? [close]", group: 0, tag: "Adverb", notIf: "(getting|becoming|feeling)", reason: "being-close" },
  { match: "(the|those|these|a|an) [#Participle] #Noun", group: 0, tag: "Adjective", reason: "blown-motor" },
  { match: "(#PresentTense|#PastTense) [back]", group: 0, tag: "Adverb", notIf: "(#PhrasalVerb|#Copula)", reason: "charge-back" },
  { match: "#Verb [around]", group: 0, tag: "Adverb", notIf: "#PhrasalVerb", reason: "send-around" },
  { match: "[later] #PresentTense", group: 0, tag: "Adverb", reason: "later-say" },
  { match: "#Determiner [well] !#PastTense?", group: 0, tag: "Noun", reason: "the-well" },
  { match: "#Adjective [enough]", group: 0, tag: "Adverb", reason: "high-enough" }
];
var dates = [
  { match: "#Holiday (day|eve)", tag: "Holiday", reason: "holiday-day" },
  { match: "#Value of #Month", tag: "Date", reason: "value-of-month" },
  { match: "#Cardinal #Month", tag: "Date", reason: "cardinal-month" },
  { match: "#Month #Value to #Value", tag: "Date", reason: "value-to-value" },
  { match: "#Month the #Value", tag: "Date", reason: "month-the-value" },
  { match: "(#WeekDay|#Month) #Value", tag: "Date", reason: "date-value" },
  { match: "#Value (#WeekDay|#Month)", tag: "Date", reason: "value-date" },
  { match: "(#TextValue && #Date) #TextValue", tag: "Date", reason: "textvalue-date" },
  { match: `#Month #NumberRange`, tag: "Date", reason: "aug 20-21" },
  { match: `#WeekDay #Month #Ordinal`, tag: "Date", reason: "week mm-dd" },
  { match: `#Month #Ordinal #Cardinal`, tag: "Date", reason: "mm-dd-yyy" },
  { match: `(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time`, tag: "Timezone", reason: "std-time" },
  {
    match: `(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time`,
    tag: "Timezone",
    reason: "eastern-time"
  },
  { match: `#Time [(eastern|mountain|pacific|central|est|pst|gmt)]`, group: 0, tag: "Timezone", reason: "5pm-central" },
  { match: `(central|western|eastern) european time`, tag: "Timezone", reason: "cet" }
];
var ambigDates = [
  { match: "[sun] the #Ordinal", tag: "WeekDay", reason: "sun-the-5th" },
  { match: "[sun] #Date", group: 0, tag: "WeekDay", reason: "sun-feb" },
  { match: "#Date (on|this|next|last|during)? [sun]", group: 0, tag: "WeekDay", reason: "1pm-sun" },
  { match: `(in|by|before|during|on|until|after|of|within|all) [sat]`, group: 0, tag: "WeekDay", reason: "sat" },
  { match: `(in|by|before|during|on|until|after|of|within|all) [wed]`, group: 0, tag: "WeekDay", reason: "wed" },
  { match: `(in|by|before|during|on|until|after|of|within|all) [march]`, group: 0, tag: "Month", reason: "march" },
  { match: "[sat] #Date", group: 0, tag: "WeekDay", reason: "sat-feb" },
  { match: `#Preposition [(march|may)]`, group: 0, tag: "Month", reason: "in-month" },
  { match: `(this|next|last) (march|may) !#Infinitive?`, tag: "#Date #Month", reason: "this-month" },
  { match: `(march|may) the? #Value`, tag: "#Month #Date #Date", reason: "march-5th" },
  { match: `#Value of? (march|may)`, tag: "#Date #Date #Month", reason: "5th-of-march" },
  { match: `[(march|may)] .? #Date`, group: 0, tag: "Month", reason: "march-and-feb" },
  { match: `#Date .? [(march|may)]`, group: 0, tag: "Month", reason: "feb-and-march" },
  { match: `#Adverb [(march|may)]`, group: 0, tag: "Verb", reason: "quickly-march" },
  { match: `[(march|may)] #Adverb`, group: 0, tag: "Verb", reason: "march-quickly" }
];
const infNouns = "(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)";
var noun = [
  { match: "(the|any) [more]", group: 0, tag: "Singular", reason: "more-noun" },
  { match: "[more] #Noun", group: 0, tag: "Adjective", reason: "more-noun" },
  { match: "(right|rights) of .", tag: "Noun", reason: "right-of" },
  { match: "a [bit]", group: 0, tag: "Singular", reason: "bit-2" },
  { match: "a [must]", group: 0, tag: "Singular", reason: "must-2" },
  { match: "(we|us) [all]", group: 0, tag: "Noun", reason: "we all" },
  { match: "due to [#Verb]", group: 0, tag: "Noun", reason: "due-to" },
  { match: "some [#Verb] #Plural", group: 0, tag: "Noun", reason: "determiner6" },
  { match: "#Possessive #Ordinal [#PastTense]", group: 0, tag: "Noun", reason: "first-thought" },
  { match: "(the|this|those|these) #Adjective [%Verb|Noun%]", group: 0, tag: "Noun", notIf: "#Copula", reason: "the-adj-verb" },
  { match: "(the|this|those|these) #Adverb #Adjective [#Verb]", group: 0, tag: "Noun", reason: "determiner4" },
  { match: "the [#Verb] #Preposition .", group: 0, tag: "Noun", reason: "determiner1" },
  { match: "(a|an|the) [#Verb] of", group: 0, tag: "Noun", reason: "the-verb-of" },
  { match: "#Determiner #Noun of [#Verb]", group: 0, tag: "Noun", notIf: "#Gerund", reason: "noun-of-noun" },
  { match: "#PastTense #Preposition [#PresentTense]", group: 0, notIf: "#Gerund", tag: "Noun", reason: "ended-in-ruins" },
  { match: "#Conjunction [u]", group: 0, tag: "Pronoun", reason: "u-pronoun-2" },
  { match: "[u] #Verb", group: 0, tag: "Pronoun", reason: "u-pronoun-1" },
  { match: "#Determiner [(western|eastern|northern|southern|central)] #Noun", group: 0, tag: "Noun", reason: "western-line" },
  { match: "(#Singular && @hasHyphen) #PresentTense", tag: "Noun", reason: "hyphen-verb" },
  { match: "is no [#Verb]", group: 0, tag: "Noun", reason: "is-no-verb" },
  { match: "do [so]", group: 0, tag: "Noun", reason: "so-noun" },
  { match: "#Determiner [(shit|damn|hell)]", group: 0, tag: "Noun", reason: "swears-noun" },
  { match: "to [(shit|hell)]", group: 0, tag: "Noun", reason: "to-swears" },
  { match: "(the|these) [#Singular] (were|are)", group: 0, tag: "Plural", reason: "singular-were" },
  { match: `a #Noun+ or #Adverb+? [#Verb]`, group: 0, tag: "Noun", reason: "noun-or-noun" },
  { match: "(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]", group: 0, tag: "Noun", notIf: "(seem|appear|include|#Gerund|#Copula)", reason: "det-inf" },
  { match: "#Noun #Actor", tag: "Actor", notIf: "(#Person|#Pronoun)", reason: "thing-doer" },
  { match: "#Gerund #Actor", tag: "Actor", reason: "gerund-doer" },
  { match: `co #Singular`, tag: "Actor", reason: "co-noun" },
  { match: `[#Noun+] #Actor`, group: 0, tag: "Actor", notIf: "(#Honorific|#Pronoun|#Possessive)", reason: "air-traffic-controller" },
  { match: `(urban|cardiac|cardiovascular|respiratory|medical|clinical|visual|graphic|creative|dental|exotic|fine|certified|registered|technical|virtual|professional|amateur|junior|senior|special|pharmaceutical|theoretical)+ #Noun? #Actor`, tag: "Actor", reason: "fine-artist" },
  { match: `#Noun+ (coach|chef|king|engineer|fellow|personality|boy|girl|man|woman|master)`, tag: "Actor", reason: "dance-coach" },
  { match: `chief . officer`, tag: "Actor", reason: "chief-x-officer" },
  { match: `chief of #Noun+`, tag: "Actor", reason: "chief-of-police" },
  { match: `senior? vice? president of #Noun+`, tag: "Actor", reason: "president-of" },
  { match: "#Determiner [sun]", group: 0, tag: "Singular", reason: "the-sun" },
  { match: "#Verb (a|an) [#Value]$", group: 0, tag: "Singular", reason: "did-a-value" },
  { match: "the [(can|will|may)]", group: 0, tag: "Singular", reason: "the can" },
  { match: "#FirstName #Acronym? (#Possessive && #LastName)", tag: "Possessive", reason: "name-poss" },
  { match: "#Organization+ #Possessive", tag: "Possessive", reason: "org-possessive" },
  { match: "#Place+ #Possessive", tag: "Possessive", reason: "place-possessive" },
  { match: "#Possessive #PresentTense #Particle?", notIf: "(#Gerund|her)", tag: "Noun", reason: "possessive-verb" },
  { match: "(my|our|their|her|his|its) [(#Plural && #Actor)] #Noun", tag: "Possessive", reason: "my-dads" },
  { match: "#Value of a [second]", group: 0, unTag: "Value", tag: "Singular", reason: "10th-of-a-second" },
  { match: "#Value [seconds]", group: 0, unTag: "Value", tag: "Plural", reason: "10-seconds" },
  { match: "in [#Infinitive]", group: 0, tag: "Singular", reason: "in-age" },
  { match: "a [#Adjective] #Preposition", group: 0, tag: "Noun", reason: "a-minor-in" },
  { match: "#Determiner [#Singular] said", group: 0, tag: "Actor", reason: "the-actor-said" },
  { match: `#Determiner #Noun [${infNouns}] !(#Preposition|to|#Adverb)?`, group: 0, tag: "Noun", reason: "the-noun-sense" },
  { match: "[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula", group: 0, tag: "Plural", reason: "photographs-of" },
  { match: "#Infinitive and [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "fight and win" },
  { match: "#Noun and [#Verb] and #Noun", group: 0, tag: "Noun", reason: "peace-and-flowers" },
  { match: "the #Cardinal [%Adj|Noun%]", group: 0, tag: "Noun", reason: "the-1992-classic" },
  { match: "#Copula the [%Adj|Noun%] #Noun", group: 0, tag: "Adjective", reason: "the-premier-university" },
  { match: "i #Verb [me] #Noun", group: 0, tag: "Possessive", reason: "scottish-me" },
  { match: "[#PresentTense] (music|class|lesson|night|party|festival|league|ceremony)", group: 0, tag: "Noun", reason: "dance-music" },
  { match: "[wit] (me|it)", group: 0, tag: "Presposition", reason: "wit-me" },
  { match: "#PastTense #Possessive [#Verb]", group: 0, tag: "Noun", notIf: "(saw|made)", reason: "left-her-boots" },
  { match: "#Value [%Plural|Verb%]", group: 0, tag: "Plural", notIf: "(one|1|a|an)", reason: "35-signs" },
  { match: "had [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Gerund|come|become)", reason: "had-time" },
  { match: "%Adj|Noun% %Noun|Verb%", tag: "#Adjective #Noun", notIf: "#ProperNoun #Noun", reason: "instant-access" },
  { match: "#Determiner [%Adj|Noun%] #Conjunction", group: 0, tag: "Noun", reason: "a-rep-to" },
  { match: "#Adjective #Noun [%Plural|Verb%]$", group: 0, tag: "Plural", notIf: "#Pronoun", reason: "near-death-experiences" },
  { match: "#Possessive #Noun [%Plural|Verb%]$", group: 0, tag: "Plural", reason: "your-guild-colors" }
];
var gerundNouns = [
  { match: "(this|that|the|a|an) [#Gerund #Infinitive]", group: 0, tag: "Singular", reason: "the-planning-process" },
  { match: "(that|the) [#Gerund #PresentTense]", group: 0, ifNo: "#Copula", tag: "Plural", reason: "the-paving-stones" },
  { match: "#Determiner [#Gerund] #Noun", group: 0, tag: "Adjective", reason: "the-gerund-noun" },
  { match: `#Pronoun #Infinitive [#Gerund] #PresentTense`, group: 0, tag: "Noun", reason: "tipping-sucks" },
  { match: "#Adjective [#Gerund]", group: 0, tag: "Noun", notIf: "(still|even|just)", reason: "early-warning" },
  { match: "[#Gerund] #Adverb? not? #Copula", group: 0, tag: "Activity", reason: "gerund-copula" },
  { match: "#Copula [(#Gerund|#Activity)] #Copula", group: 0, tag: "Gerund", reason: "are-doing-is" },
  { match: "[#Gerund] #Modal", group: 0, tag: "Activity", reason: "gerund-modal" },
  { match: "#Singular for [%Noun|Gerund%]", group: 0, tag: "Gerund", reason: "noun-for-gerund" },
  { match: "#Comparative (for|at) [%Noun|Gerund%]", group: 0, tag: "Gerund", reason: "better-for-gerund" },
  { match: "#PresentTense the [#Gerund]", group: 0, tag: "Noun", reason: "keep-the-touching" }
];
var presNouns = [
  { match: "#Infinitive (this|that|the) [#Infinitive]", group: 0, tag: "Noun", reason: "do-this-dance" },
  { match: "#Gerund #Determiner [#Infinitive]", group: 0, tag: "Noun", reason: "running-a-show" },
  { match: "#Determiner (only|further|just|more|backward) [#Infinitive]", group: 0, tag: "Noun", reason: "the-only-reason" },
  { match: "(the|this|a|an) [#Infinitive] #Adverb? #Verb", group: 0, tag: "Noun", reason: "determiner5" },
  { match: "#Determiner #Adjective #Adjective? [#Infinitive]", group: 0, tag: "Noun", reason: "a-nice-inf" },
  { match: "#Determiner #Demonym [#PresentTense]", group: 0, tag: "Noun", reason: "mexican-train" },
  { match: "#Adjective #Noun+ [#Infinitive] #Copula", group: 0, tag: "Noun", reason: "career-move" },
  { match: "at some [#Infinitive]", group: 0, tag: "Noun", reason: "at-some-inf" },
  { match: "(go|goes|went) to [#Infinitive]", group: 0, tag: "Noun", reason: "goes-to-verb" },
  { match: "(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)", group: 0, notIf: "from", tag: "Noun", reason: "a-noun-inf" },
  { match: "(a|an) #Noun [#Infinitive]$", group: 0, tag: "Noun", reason: "a-noun-inf2" },
  { match: "#Gerund #Adjective? for [#Infinitive]", group: 0, tag: "Noun", reason: "running-for" },
  { match: "about [#Infinitive]", group: 0, tag: "Singular", reason: "about-love" },
  { match: "#Plural on [#Infinitive]", group: 0, tag: "Noun", reason: "on-stage" },
  { match: "any [#Infinitive]", group: 0, tag: "Noun", reason: "any-charge" },
  { match: "no [#Infinitive]", group: 0, tag: "Noun", reason: "no-doubt" },
  { match: "number of [#PresentTense]", group: 0, tag: "Noun", reason: "number-of-x" },
  { match: "(taught|teaches|learns|learned) [#PresentTense]", group: 0, tag: "Noun", reason: "teaches-x" },
  { match: "(try|use|attempt|build|make) [#Verb #Particle?]", notIf: "(#Copula|#Noun|sure|fun|up)", group: 0, tag: "Noun", reason: "do-verb" },
  { match: "^[#Infinitive] (is|was)", group: 0, tag: "Noun", reason: "checkmate-is" },
  { match: "#Infinitive much [#Infinitive]", group: 0, tag: "Noun", reason: "get-much" },
  { match: "[cause] #Pronoun #Verb", group: 0, tag: "Conjunction", reason: "cause-cuz" },
  { match: "the #Singular [#Infinitive] #Noun", group: 0, tag: "Noun", notIf: "#Pronoun", reason: "cardio-dance" },
  { match: "#Determiner #Modal [#Noun]", group: 0, tag: "PresentTense", reason: "should-smoke" },
  { match: "this [#Plural]", group: 0, tag: "PresentTense", notIf: "(#Preposition|#Date)", reason: "this-verbs" },
  { match: "#Noun that [#Plural]", group: 0, tag: "PresentTense", notIf: "(#Preposition|#Pronoun|way)", reason: "voice-that-rocks" },
  { match: "that [#Plural] to", group: 0, tag: "PresentTense", notIf: "#Preposition", reason: "that-leads-to" },
  {
    match: "(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)",
    group: 0,
    tag: "Infinitive",
    reason: "let-him-glue"
  },
  { match: "#Verb (all|every|each|most|some|no) [#PresentTense]", notIf: "#Modal", group: 0, tag: "Noun", reason: "all-presentTense" },
  { match: "(had|have|#PastTense) #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "better", reason: "adj-presentTense" },
  { match: "#Value #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "one-big-reason" },
  { match: "#PastTense #Adjective+ [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Copula|better)", reason: "won-wide-support" },
  { match: "(many|few|several|couple) [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "many-poses" },
  { match: "#Determiner #Adverb #Adjective [%Noun|Verb%]", group: 0, tag: "Noun", notIf: "#Copula", reason: "very-big-dream" },
  { match: "from #Noun to [%Noun|Verb%]", group: 0, tag: "Noun", reason: "start-to-finish" },
  { match: "(for|with|of) #Noun (and|or|not) [%Noun|Verb%]", group: 0, tag: "Noun", notIf: "#Pronoun", reason: "for-food-and-gas" },
  { match: "#Adjective #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "adorable-little-store" },
  { match: "#Gerund #Adverb? #Comparative [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "higher-costs" },
  { match: "(#Noun && @hasComma) #Noun (and|or) [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "noun-list" },
  { match: "(many|any|some|several) [#PresentTense] for", group: 0, tag: "Noun", reason: "any-verbs-for" },
  { match: `to #PresentTense #Noun [#PresentTense] #Preposition`, group: 0, tag: "Noun", reason: "gas-exchange" },
  { match: `#PastTense (until|as|through|without) [#PresentTense]`, group: 0, tag: "Noun", reason: "waited-until-release" },
  { match: `#Gerund like #Adjective? [#PresentTense]`, group: 0, tag: "Plural", reason: "like-hot-cakes" },
  { match: `some #Adjective [#PresentTense]`, group: 0, tag: "Noun", reason: "some-reason" },
  { match: `for some [#PresentTense]`, group: 0, tag: "Noun", reason: "for-some-reason" },
  { match: `(same|some|the|that|a) kind of [#PresentTense]`, group: 0, tag: "Noun", reason: "some-kind-of" },
  { match: `(same|some|the|that|a) type of [#PresentTense]`, group: 0, tag: "Noun", reason: "some-type-of" },
  { match: `#Gerund #Adjective #Preposition [#PresentTense]`, group: 0, tag: "Noun", reason: "doing-better-for-x" },
  { match: `(get|got|have) #Comparative [#PresentTense]`, group: 0, tag: "Noun", reason: "got-better-aim" },
  { match: "whose [#PresentTense] #Copula", group: 0, tag: "Noun", reason: "whos-name-was" },
  { match: `#PhrasalVerb #Particle #Preposition [#PresentTense]`, group: 0, tag: "Noun", reason: "given-up-on-x" },
  { match: "there (are|were) #Adjective? [#PresentTense]", group: 0, tag: "Plural", reason: "there-are" },
  { match: "#Value [#PresentTense] of", group: 0, notIf: "(one|1|#Copula|#Infinitive)", tag: "Plural", reason: "2-trains" },
  { match: "[#PresentTense] (are|were) #Adjective", group: 0, tag: "Plural", reason: "compromises-are-possible" },
  { match: "^[(hope|guess|thought|think)] #Pronoun #Verb", group: 0, tag: "Infinitive", reason: "suppose-i" },
  { match: "#Possessive #Adjective [#Verb]", group: 0, tag: "Noun", notIf: "#Copula", reason: "our-full-support" },
  { match: "[(tastes|smells)] #Adverb? #Adjective", group: 0, tag: "PresentTense", reason: "tastes-good" },
  { match: "#Copula #Gerund [#PresentTense] !by?", group: 0, tag: "Noun", notIf: "going", reason: "ignoring-commute" },
  { match: "#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]", group: 0, tag: "Noun", reason: "noun-past" },
  { match: "how to [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "how-to-noun" },
  { match: "which [%Noun|Verb%] #Noun", group: 0, tag: "Infinitive", reason: "which-boost-it" },
  { match: "#Gerund [%Plural|Verb%]", group: 0, tag: "Plural", reason: "asking-questions" },
  { match: "(ready|available|difficult|hard|easy|made|attempt|try) to [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "ready-to-noun" },
  { match: "(bring|went|go|drive|run|bike) to [%Noun|Verb%]", group: 0, tag: "Noun", reason: "bring-to-noun" },
  { match: "#Modal #Noun [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "would-you-look" },
  { match: "#Copula just [#Infinitive]", group: 0, tag: "Noun", reason: "is-just-spam" },
  { match: "^%Noun|Verb% %Plural|Verb%", tag: "Imperative #Plural", reason: "request-copies" },
  { match: "#Adjective #Plural and [%Plural|Verb%]", group: 0, tag: "#Plural", reason: "pickles-and-drinks" },
  { match: "#Determiner #Year [#Verb]", group: 0, tag: "Noun", reason: "the-1968-film" },
  { match: "#Determiner [#PhrasalVerb #Particle]", group: 0, tag: "Noun", reason: "the-break-up" },
  { match: "#Determiner [%Adj|Noun%] #Noun", group: 0, tag: "Adjective", notIf: "(#Pronoun|#Possessive|#ProperNoun)", reason: "the-individual-goals" },
  { match: "[%Noun|Verb%] or #Infinitive", group: 0, tag: "Infinitive", reason: "work-or-prepare" },
  { match: "to #Infinitive [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Gerund|#Copula|help)", reason: "to-give-thanks" },
  { match: "[#Noun] me", group: 0, tag: "Verb", reason: "kills-me" },
  { match: "%Plural|Verb% %Plural|Verb%", tag: "#PresentTense #Plural", reason: "removes-wrinkles" }
];
var money = [
  { match: "#Money and #Money #Currency?", tag: "Money", reason: "money-and-money" },
  { match: "#Value #Currency [and] #Value (cents|ore|centavos|sens)", group: 0, tag: "money", reason: "and-5-cents" },
  { match: "#Value (mark|rand|won|rub|ore)", tag: "#Money #Currency", reason: "4-mark" },
  { match: "a pound", tag: "#Money #Unit", reason: "a-pound" },
  { match: "#Value (pound|pounds)", tag: "#Money #Unit", reason: "4-pounds" }
];
var fractions$1 = [
  { match: "[(half|quarter)] of? (a|an)", group: 0, tag: "Fraction", reason: "millionth" },
  { match: "#Adverb [half]", group: 0, tag: "Fraction", reason: "nearly-half" },
  { match: "[half] the", group: 0, tag: "Fraction", reason: "half-the" },
  { match: "#Cardinal and a half", tag: "Fraction", reason: "and-a-half" },
  { match: "#Value (halves|halfs|quarters)", tag: "Fraction", reason: "two-halves" },
  { match: "a #Ordinal", tag: "Fraction", reason: "a-quarter" },
  { match: "[#Cardinal+] (#Fraction && /s$/)", tag: "Fraction", reason: "seven-fifths" },
  { match: "[#Cardinal+ #Ordinal] of .", group: 0, tag: "Fraction", reason: "ordinal-of" },
  { match: "[(#NumericValue && #Ordinal)] of .", group: 0, tag: "Fraction", reason: "num-ordinal-of" },
  { match: "(a|one) #Cardinal?+ #Ordinal", tag: "Fraction", reason: "a-ordinal" },
  { match: "#Cardinal+ out? of every? #Cardinal", tag: "Fraction", reason: "out-of" }
];
var numbers$2 = [
  { match: `#Cardinal [second]`, tag: "Unit", reason: "one-second" },
  {
    match: "!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)",
    group: 0,
    tag: "Value",
    reason: "a-is-one"
  },
  { match: "1 #Value #PhoneNumber", tag: "PhoneNumber", reason: "1-800-Value" },
  { match: "#NumericValue #PhoneNumber", tag: "PhoneNumber", reason: "(800) PhoneNumber" },
  { match: "#Demonym #Currency", tag: "Currency", reason: "demonym-currency" },
  { match: "#Value [(buck|bucks|grand)]", group: 0, tag: "Currency", reason: "value-bucks" },
  { match: "[#Value+] #Currency", group: 0, tag: "Money", reason: "15 usd" },
  { match: "[second] #Noun", group: 0, tag: "Ordinal", reason: "second-noun" },
  { match: "#Value+ [#Currency]", group: 0, tag: "Unit", reason: "5-yan" },
  { match: "#Value [(foot|feet)]", group: 0, tag: "Unit", reason: "foot-unit" },
  { match: "#Value [#Abbreviation]", group: 0, tag: "Unit", reason: "value-abbr" },
  { match: "#Value [k]", group: 0, tag: "Unit", reason: "value-k" },
  { match: "#Unit an hour", tag: "Unit", reason: "unit-an-hour" },
  { match: "(minus|negative) #Value", tag: "Value", reason: "minus-value" },
  { match: "#Value (point|decimal) #Value", tag: "Value", reason: "value-point-value" },
  { match: "#Determiner [(half|quarter)] #Ordinal", group: 0, tag: "Value", reason: "half-ordinal" },
  { match: `#Multiple+ and #Value`, tag: "Value", reason: "magnitude-and-value" },
  { match: "#Value #Unit [(per|an) (hr|hour|sec|second|min|minute)]", group: 0, tag: "Unit", reason: "12-miles-per-second" },
  { match: "#Value [(square|cubic)] #Unit", group: 0, tag: "Unit", reason: "square-miles" },
  { match: "^[#Value] (#Determiner|#Gerund)", group: 0, tag: "Expression", unTag: "Value", reason: "numbered-list" }
];
var person = [
  { match: "#Copula [(#Noun|#PresentTense)] #LastName", group: 0, tag: "FirstName", reason: "copula-noun-lastname" },
  { match: "(sister|pope|brother|father|aunt|uncle|grandpa|grandfather|grandma) #ProperNoun", tag: "Person", reason: "lady-titlecase", safe: true },
  { match: "#FirstName [#Determiner #Noun] #LastName", group: 0, tag: "Person", reason: "first-noun-last" },
  {
    match: "#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun",
    tag: "Person",
    reason: "titlecase-acronym-titlecase",
    safe: true
  },
  { match: "#Acronym #LastName", tag: "Person", reason: "acronym-lastname", safe: true },
  { match: "#Person (jr|sr|md)", tag: "Person", reason: "person-honorific" },
  { match: "#Honorific #Acronym", tag: "Person", reason: "Honorific-TitleCase" },
  { match: "#Person #Person the? #RomanNumeral", tag: "Person", reason: "roman-numeral" },
  { match: "#FirstName [/^[^aiurck]$/]", group: 0, tag: ["Acronym", "Person"], reason: "john-e" },
  { match: "#Noun van der? #Noun", tag: "Person", reason: "van der noun", safe: true },
  { match: "(king|queen|prince|saint|lady) of #Noun", tag: "Person", reason: "king-of-noun", safe: true },
  { match: "(prince|lady) #Place", tag: "Person", reason: "lady-place" },
  { match: "(king|queen|prince|saint) #ProperNoun", tag: "Person", reason: "saint-foo" },
  { match: "al (#Person|#ProperNoun)", tag: "Person", reason: "al-borlen", safe: true },
  { match: "#FirstName de #Noun", tag: "Person", reason: "bill-de-noun" },
  { match: "#FirstName (bin|al) #Noun", tag: "Person", reason: "bill-al-noun" },
  { match: "#FirstName #Acronym #ProperNoun", tag: "Person", reason: "bill-acronym-title" },
  { match: "#FirstName #FirstName #ProperNoun", tag: "Person", reason: "bill-firstname-title" },
  { match: "#Honorific #FirstName? #ProperNoun", tag: "Person", reason: "dr-john-Title" },
  { match: "#FirstName the #Adjective", tag: "Person", reason: "name-the-great" },
  { match: "#ProperNoun (van|al|bin) #ProperNoun", tag: "Person", reason: "title-van-title", safe: true },
  { match: "#ProperNoun (de|du) la? #ProperNoun", tag: "Person", reason: "title-de-title" },
  { match: "#Singular #Acronym #LastName", tag: "#FirstName #Person .", reason: "title-acro-noun", safe: true },
  { match: "[#ProperNoun] #Person", group: 0, tag: "Person", reason: "proper-person", safe: true },
  { match: "#Person [#ProperNoun #ProperNoun]", group: 0, tag: "Person", notIf: "#Possessive", reason: "three-name-person", safe: true },
  { match: "#FirstName #Acronym? [#ProperNoun]", group: 0, tag: "LastName", notIf: "#Possessive", reason: "firstname-titlecase" },
  { match: "#FirstName [#FirstName]", group: 0, tag: "LastName", reason: "firstname-firstname" },
  { match: "#FirstName #Acronym #Noun", tag: "Person", reason: "n-acro-noun", safe: true },
  { match: "#FirstName [(de|di|du|van|von)] #Person", group: 0, tag: "LastName", reason: "de-firstname" },
  { match: "[(lieutenant|corporal|sergeant|captain|qeen|king|admiral|major|colonel|marshal|president|queen|king)+] #ProperNoun", group: 0, tag: "Honorific", reason: "seargeant-john" },
  { match: "[(private|general|major|rear|prime|field|count|miss)] #Honorific? #Person", group: 0, tag: ["Honorific", "Person"], reason: "ambg-honorifics" },
  { match: "#Honorific #FirstName [#Singular]", group: 0, tag: "LastName", notIf: "#Possessive", reason: "dr-john-foo", safe: true },
  { match: "[(his|her) (majesty|honour|worship|excellency|honorable)] #Person", group: 0, tag: "Honorific", reason: "his-excellency" },
  { match: "#Honorific #Actor", tag: "Honorific", reason: "Lieutenant colonel" },
  { match: "(first|second|third|1st|2nd|3rd) #Actor", tag: "Honorific", reason: "first lady" },
  { match: "#Person #RomanNumeral", tag: "Person", reason: "louis-IV" }
];
var personName = [
  { match: "%Person|Date% #Acronym? #ProperNoun", tag: "Person", reason: "jan-thierson" },
  { match: "%Person|Noun% #Acronym? #ProperNoun", tag: "Person", reason: "switch-person", safe: true },
  { match: "%Person|Noun% #Organization", tag: "Organization", reason: "olive-garden" },
  { match: "%Person|Verb% #Acronym? #ProperNoun", tag: "Person", reason: "verb-propernoun", ifNo: "#Actor" },
  { match: `[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)`, group: 0, tag: "Person", reason: "person-said" },
  { match: `[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)`, group: 0, tag: "Place", reason: "sydney-harbour" },
  { match: `(west|east|north|south) [%Person|Place%]`, group: 0, tag: "Place", reason: "east-sydney" },
  { match: `#Modal [%Person|Verb%]`, group: 0, tag: "Verb", reason: "would-mark" },
  { match: `#Adverb [%Person|Verb%]`, group: 0, tag: "Verb", reason: "really-mark" },
  { match: `[%Person|Verb%] (#Adverb|#Comparative)`, group: 0, tag: "Verb", reason: "drew-closer" },
  { match: `%Person|Verb% #Person`, tag: "Person", reason: "rob-smith" },
  { match: `%Person|Verb% #Acronym #ProperNoun`, tag: "Person", reason: "rob-a-smith" },
  { match: "[will] #Verb", group: 0, tag: "Modal", reason: "will-verb" },
  { match: "(will && @isTitleCase) #ProperNoun", tag: "Person", reason: "will-name" },
  { match: "(#FirstName && !#Possessive) [#Singular] #Verb", group: 0, safe: true, tag: "LastName", reason: "jack-layton" },
  { match: "^[#Singular] #Person #Verb", group: 0, safe: true, tag: "Person", reason: "sherwood-anderson" },
  { match: "(a|an) [#Person]$", group: 0, unTag: "Person", reason: "a-warhol" }
];
var verbs$1 = [
  {
    match: "#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)",
    tag: "#Copula #Adverb #Adjective",
    reason: "sometimes-adverb"
  },
  { match: "(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense", group: 0, tag: "Modal", reason: "i-better" },
  { match: "(#Modal|i|they|we|do) not? [like]", group: 0, tag: "PresentTense", reason: "modal-like" },
  { match: "#Noun #Adverb? [left]", group: 0, tag: "PastTense", reason: "left-verb" },
  { match: "will #Adverb? not? #Adverb? [be] #Gerund", group: 0, tag: "Copula", reason: "will-be-copula" },
  { match: "will #Adverb? not? #Adverb? [be] #Adjective", group: 0, tag: "Copula", reason: "be-copula" },
  { match: "[march] (up|down|back|toward)", notIf: "#Date", group: 0, tag: "Infinitive", reason: "march-to" },
  { match: "#Modal [march]", group: 0, tag: "Infinitive", reason: "must-march" },
  { match: `[may] be`, group: 0, tag: "Verb", reason: "may-be" },
  { match: `[(subject|subjects|subjected)] to`, group: 0, tag: "Verb", reason: "subject to" },
  { match: `[home] to`, group: 0, tag: "PresentTense", reason: "home to" },
  { match: "[open] #Determiner", group: 0, tag: "Infinitive", reason: "open-the" },
  { match: `(were|was) being [#PresentTense]`, group: 0, tag: "PastTense", reason: "was-being" },
  { match: `(had|has|have) [been /en$/]`, group: 0, tag: "Auxiliary Participle", reason: "had-been-broken" },
  { match: `(had|has|have) [been /ed$/]`, group: 0, tag: "Auxiliary PastTense", reason: "had-been-smoked" },
  { match: `(had|has) #Adverb? [been] #Adverb? #PastTense`, group: 0, tag: "Auxiliary", reason: "had-been-adj" },
  { match: `(had|has) to [#Noun] (#Determiner|#Possessive)`, group: 0, tag: "Infinitive", reason: "had-to-noun" },
  { match: `have [#PresentTense]`, group: 0, tag: "PastTense", notIf: "(come|gotten)", reason: "have-read" },
  { match: `(does|will|#Modal) that [work]`, group: 0, tag: "PastTense", reason: "does-that-work" },
  { match: `[(sound|sounds)] #Adjective`, group: 0, tag: "PresentTense", reason: "sounds-fun" },
  { match: `[(look|looks)] #Adjective`, group: 0, tag: "PresentTense", reason: "looks-good" },
  { match: `[(start|starts|stop|stops|begin|begins)] #Gerund`, group: 0, tag: "Verb", reason: "starts-thinking" },
  { match: `(have|had) read`, tag: "Modal #PastTense", reason: "read-read" },
  {
    match: `(is|was|were) [(under|over) #PastTense]`,
    group: 0,
    tag: "Adverb Adjective",
    reason: "was-under-cooked"
  },
  { match: "[shit] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear1-verb" },
  { match: "[damn] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear2-verb" },
  { match: "[fuck] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear3-verb" },
  { match: "#Plural that %Noun|Verb%", tag: ". #Preposition #Infinitive", reason: "jobs-that-work" },
  { match: "[works] for me", group: 0, tag: "PresentTense", reason: "works-for-me" },
  { match: "as #Pronoun [please]", group: 0, tag: "Infinitive", reason: "as-we-please" },
  { match: "[(co|mis|de|inter|intra|pre|re|un|out|under|over|counter)] #Verb", group: 0, tag: ["Verb", "Prefix"], notIf: "(#Copula|#PhrasalVerb)", reason: "co-write" },
  { match: "#PastTense and [%Adj|Past%]", group: 0, tag: "PastTense", reason: "dressed-and-left" },
  { match: "[%Adj|Past%] and #PastTense", group: 0, tag: "PastTense", reason: "dressed-and-left" },
  { match: "#Copula #Pronoun [%Adj|Past%]", group: 0, tag: "Adjective", reason: "is-he-stoked" },
  { match: "to [%Noun|Verb%] #Preposition", group: 0, tag: "Infinitive", reason: "to-dream-of" }
];
var auxiliary = [
  { match: `will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb`, group: 0, tag: "Auxiliary", reason: "will-have-vb" },
  { match: `[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)`, group: 0, tag: "Auxiliary", reason: "copula-walking" },
  { match: `[(#Modal|did)+] (#Adverb|not)+? #Verb`, group: 0, tag: "Auxiliary", reason: "modal-verb" },
  { match: `#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb`, group: 0, tag: "Auxiliary", reason: "would-have" },
  { match: `[(has|had)] (#Adverb|not)+? #PastTense`, group: 0, tag: "Auxiliary", reason: "had-walked" },
  { match: "[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb", group: 0, tag: "Auxiliary", reason: "have-had" },
  { match: "[about to] #Adverb? #Verb", group: 0, tag: ["Auxiliary", "Verb"], reason: "about-to" },
  { match: `#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb`, group: 0, tag: "Auxiliary", reason: "would-be" },
  { match: `[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb`, group: 0, tag: "Auxiliary", reason: "had-been" },
  { match: "[(be|being|been)] #Participle", group: 0, tag: "Auxiliary", reason: "being-driven" },
  { match: "[may] #Adverb? #Infinitive", group: 0, tag: "Auxiliary", reason: "may-want" },
  { match: "#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense", group: 0, tag: "Auxiliary", reason: "being-walked" },
  { match: "will [be] #PastTense", group: 0, tag: "Auxiliary", reason: "will-be-x" },
  { match: "[(be|been)] (#Adverb|not)+? #Gerund", group: 0, tag: "Auxiliary", reason: "been-walking" },
  { match: "[used to] #PresentTense", group: 0, tag: "Auxiliary", reason: "used-to-walk" },
  { match: "#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense", group: 0, tag: "Auxiliary", reason: "going-to-walk" },
  { match: "#Imperative [(me|him|her)]", group: 0, tag: "Reflexive", reason: "tell-him" },
  { match: "(is|was) #Adverb? [no]", group: 0, tag: "Negative", reason: "is-no" },
  { match: "[(been|had|became|came)] #PastTense", group: 0, notIf: "#PhrasalVerb", tag: "Auxiliary", reason: "been-told" },
  { match: "[(being|having|getting)] #Verb", group: 0, tag: "Auxiliary", reason: "being-born" },
  { match: "[be] #Gerund", group: 0, tag: "Auxiliary", reason: "be-walking" },
  { match: "[better] #PresentTense", group: 0, tag: "Modal", notIf: "(#Copula|#Gerund)", reason: "better-go" },
  { match: "even better", tag: "Adverb #Comparative", reason: "even-better" }
];
var phrasal = [
  { match: "(#Verb && @hasHyphen) up", tag: "PhrasalVerb", reason: "foo-up" },
  { match: "(#Verb && @hasHyphen) off", tag: "PhrasalVerb", reason: "foo-off" },
  { match: "(#Verb && @hasHyphen) over", tag: "PhrasalVerb", reason: "foo-over" },
  { match: "(#Verb && @hasHyphen) out", tag: "PhrasalVerb", reason: "foo-out" },
  {
    match: "[#Verb (in|out|up|down|off|back)] (on|in)",
    notIf: "#Copula",
    tag: "PhrasalVerb Particle",
    reason: "walk-in-on"
  },
  { match: "(lived|went|crept|go) [on] for", group: 0, tag: "PhrasalVerb", reason: "went-on" },
  { match: "#Verb (up|down|in|on|for)$", tag: "PhrasalVerb #Particle", notIf: "#PhrasalVerb", reason: "come-down$" },
  { match: "help [(stop|end|make|start)]", group: 0, tag: "Infinitive", reason: "help-stop" },
  { match: "#PhrasalVerb (in && #Particle) #Determiner", tag: "#Verb #Preposition #Determiner", unTag: "PhrasalVerb", reason: "work-in-the" },
  { match: "[(stop|start|finish|help)] #Gerund", group: 0, tag: "Infinitive", reason: "start-listening" },
  {
    match: "#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]",
    group: 0,
    tag: "Adverb",
    reason: "phrasal-pronoun-advb"
  }
];
const notIf = "(i|we|they)";
var imperative = [
  { match: "^do not? [#Infinitive #Particle?]", notIf, group: 0, tag: "Imperative", reason: "do-eat" },
  { match: "^please do? not? [#Infinitive #Particle?]", group: 0, tag: "Imperative", reason: "please-go" },
  { match: "^just do? not? [#Infinitive #Particle?]", group: 0, tag: "Imperative", reason: "just-go" },
  { match: "^[#Infinitive] it #Comparative", notIf, group: 0, tag: "Imperative", reason: "do-it-better" },
  { match: "^[#Infinitive] it (please|now|again|plz)", notIf, group: 0, tag: "Imperative", reason: "do-it-please" },
  { match: "^[#Infinitive] (#Adjective|#Adverb)$", group: 0, tag: "Imperative", notIf: "(so|such|rather|enough)", reason: "go-quickly" },
  { match: "^[#Infinitive] (up|down|over) #Determiner", group: 0, tag: "Imperative", reason: "turn-down" },
  { match: "^[#Infinitive] (your|my|the|a|an|any|each|every|some|more|with|on)", group: 0, notIf: "like", tag: "Imperative", reason: "eat-my-shorts" },
  { match: "^[#Infinitive] (him|her|it|us|me|there)", group: 0, tag: "Imperative", reason: "tell-him" },
  { match: "^[#Infinitive] #Adjective #Noun$", group: 0, tag: "Imperative", reason: "avoid-loud-noises" },
  { match: "^[#Infinitive] (#Adjective|#Adverb)? and #Infinitive", group: 0, tag: "Imperative", reason: "call-and-reserve" },
  { match: "^(go|stop|wait|hurry) please?$", tag: "Imperative", reason: "go" },
  { match: "^(somebody|everybody) [#Infinitive]", group: 0, tag: "Imperative", reason: "somebody-call" },
  { match: "^let (us|me) [#Infinitive]", group: 0, tag: "Imperative", reason: "lets-leave" },
  { match: "^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun", group: 0, tag: "Imperative", reason: "shut-the-door" },
  { match: "^[#PhrasalVerb #Particle] #Determiner #Noun", group: 0, tag: "Imperative", reason: "turn-off-the-light" },
  { match: "^[go] to .", group: 0, tag: "Imperative", reason: "go-to-toronto" },
  { match: "^#Modal you [#Infinitive]", group: 0, tag: "Imperative", reason: "would-you-" },
  { match: "^never [#Infinitive]", group: 0, tag: "Imperative", reason: "never-stop" },
  { match: "^come #Infinitive", tag: "Imperative", notIf: "on", reason: "come-have" },
  { match: "^come and? #Infinitive", tag: "Imperative . Imperative", notIf: "#PhrasalVerb", reason: "come-and-have" },
  { match: "^stay (out|away|back)", tag: "Imperative", reason: "stay-away" },
  { match: "^[(stay|be|keep)] #Adjective", group: 0, tag: "Imperative", reason: "stay-cool" },
  { match: "^[keep it] #Adjective", group: 0, tag: "Imperative", reason: "keep-it-cool" },
  { match: "^do not [#Infinitive]", group: 0, tag: "Imperative", reason: "do-not-be" },
  { match: "[#Infinitive] (yourself|yourselves)", group: 0, tag: "Imperative", reason: "allow-yourself" },
  { match: "[#Infinitive] what .", group: 0, tag: "Imperative", reason: "look-what" },
  { match: "^[#Infinitive] #Gerund", group: 0, tag: "Imperative", reason: "keep-playing" },
  { match: "^[#Infinitive] (to|for|into|toward|here|there)", group: 0, tag: "Imperative", reason: "go-to" },
  { match: "^[#Infinitive] (and|or) #Infinitive", group: 0, tag: "Imperative", reason: "inf-and-inf" },
  { match: "^[%Noun|Verb%] to", group: 0, tag: "Imperative", reason: "commit-to" },
  { match: "^[#Infinitive] #Adjective? #Singular #Singular", group: 0, tag: "Imperative", reason: "maintain-eye-contact" },
  { match: "do not (forget|omit|neglect) to [#Infinitive]", group: 0, tag: "Imperative", reason: "do-not-forget" },
  { match: "^[(ask|wear|pay|look|help|show|watch|act|fix|kill|stop|start|turn|try|win)] #Noun", group: 0, tag: "Imperative", reason: "pay-attention" }
];
var adjGerund = [
  { match: "(that|which) were [%Adj|Gerund%]", group: 0, tag: "Gerund", reason: "that-were-growing" },
  { match: "#Gerund [#Gerund] #Plural", group: 0, tag: "Adjective", reason: "hard-working-fam" }
];
var passive$1 = [
  { match: "(got|were|was|is|are|am) (#PastTense|#Participle)", tag: "Passive", reason: "got-walked" },
  { match: "(was|were|is|are|am) being (#PastTense|#Participle)", tag: "Passive", reason: "was-being" },
  { match: "(had|have|has) been (#PastTense|#Participle)", tag: "Passive", reason: "had-been" },
  { match: "will be being? (#PastTense|#Participle)", tag: "Passive", reason: "will-be-cleaned" },
  { match: "#Noun [(#PastTense|#Participle)] by (the|a) #Noun", group: 0, tag: "Passive", reason: "suffered-by" }
];
let matches$1 = [
  { match: "u r", tag: "#Pronoun #Copula", reason: "u r" },
  { match: "#Noun [(who|whom)]", group: 0, tag: "Determiner", reason: "captain-who" },
  { match: "[had] #Noun+ #PastTense", group: 0, tag: "Condition", reason: "had-he" },
  { match: "[were] #Noun+ to #Infinitive", group: 0, tag: "Condition", reason: "were-he" },
  { match: "some sort of", tag: "Adjective Noun Conjunction", reason: "some-sort-of" },
  { match: "of some sort", tag: "Conjunction Adjective Noun", reason: "of-some-sort" },
  { match: "[such] (a|an|is)? #Noun", group: 0, tag: "Determiner", reason: "such-skill" },
  { match: "[right] (before|after|in|into|to|toward)", group: 0, tag: "#Adverb", reason: "right-into" },
  { match: "#Preposition [about]", group: 0, tag: "Adjective", reason: "at-about" },
  { match: "(are|#Modal|see|do|for) [ya]", group: 0, tag: "Pronoun", reason: "are-ya" },
  { match: "[long live] .", group: 0, tag: "#Adjective #Infinitive", reason: "long-live" },
  { match: "[plenty] of", group: 0, tag: "#Uncountable", reason: "plenty-of" },
  { match: "(always|nearly|barely|practically) [there]", group: 0, tag: "Adjective", reason: "always-there" },
  { match: "[there] (#Adverb|#Pronoun)? #Copula", group: 0, tag: "There", reason: "there-is" },
  { match: "#Copula [there] .", group: 0, tag: "There", reason: "is-there" },
  { match: "#Modal #Adverb? [there]", group: 0, tag: "There", reason: "should-there" },
  { match: "^[do] (you|we|they)", group: 0, tag: "QuestionWord", reason: "do-you" },
  { match: "^[does] (he|she|it|#ProperNoun)", group: 0, tag: "QuestionWord", reason: "does-he" },
  { match: "a [while]", group: 0, tag: "Noun", reason: "a-while" },
  { match: "guess who", tag: "#Infinitive #QuestionWord", reason: "guess-who" },
  { match: "[fucking] !#Verb", group: 0, tag: "#Gerund", reason: "f-as-gerund" }
];
var misc$1 = matches$1;
var orgs$1 = [
  { match: "#Noun (&|n) #Noun", tag: "Organization", reason: "Noun-&-Noun" },
  { match: "#Organization of the? #ProperNoun", tag: "Organization", reason: "org-of-place", safe: true },
  { match: "#Organization #Country", tag: "Organization", reason: "org-country" },
  { match: "#ProperNoun #Organization", tag: "Organization", reason: "titlecase-org" },
  { match: "#ProperNoun (ltd|co|inc|dept|assn|bros)", tag: "Organization", reason: "org-abbrv" },
  { match: "the [#Acronym]", group: 0, tag: "Organization", reason: "the-acronym", safe: true },
  {
    match: "(world|global|international|national|#Demonym) #Organization",
    tag: "Organization",
    reason: "global-org"
  },
  { match: "#Noun+ (public|private) school", tag: "School", reason: "noun-public-school" }
];
var places$1 = [
  { match: "(west|north|south|east|western|northern|southern|eastern)+ #Place", tag: "Region", reason: "west-norfolk" },
  { match: "#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]", group: 0, tag: "Region", reason: "us-state" },
  { match: "portland [or]", group: 0, tag: "Region", reason: "portland-or" },
  { match: "#ProperNoun+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)", tag: "Region", reason: "foo-district" },
  { match: "#ProperNoun+ (river|lake|bay|inlet|creek|narrows|cove|dune|coast|lagoon|beach|peninsula|hill|mountain|canyon|marsh|island|trail|valley|glacier|estuary|desert|escarpment|gorge|plains|waterfall)", tag: "Place", reason: "foo-river" },
  { match: "(river|gulf|lake) of? #ProperNoun+", tag: "Place", reason: "river-foo" },
  { match: "(district|region|province|municipality|territory|burough|state) of #ProperNoun", tag: "Region", reason: "district-of-Foo" },
  { match: "in [#ProperNoun] #Place", group: 0, tag: "Place", reason: "propernoun-place" },
  { match: "#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)", tag: "Address", reason: "address-st" }
];
var conjunctions = [
  { match: "[so] #Noun", group: 0, tag: "Conjunction", reason: "so-conj" },
  {
    match: "[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)",
    group: 0,
    tag: "Conjunction",
    reason: "how-he-is-x"
  },
  { match: "#Copula [(who|what|where|why|how|when)] #Noun", group: 0, tag: "Conjunction", reason: "when-he" },
  { match: "#Verb [that] #Pronoun", group: 0, tag: "Conjunction", reason: "said-that-he" },
  { match: "#Noun [that] #Copula", group: 0, tag: "Conjunction", reason: "that-are" },
  { match: "#Noun [that] #Verb #Adjective", group: 0, tag: "Conjunction", reason: "that-seem" },
  { match: "#Noun #Copula not? [that] #Adjective", group: 0, tag: "Adverb", reason: "that-adj" },
  { match: "#Verb #Adverb? #Noun [(that|which)]", group: 0, tag: "Preposition", reason: "that-prep" },
  { match: "@hasComma [which] (#Pronoun|#Verb)", group: 0, tag: "Preposition", reason: "which-copula" },
  { match: "#Noun [like] #Noun", group: 0, tag: "Preposition", reason: "noun-like" },
  { match: "^[like] #Determiner", group: 0, tag: "Preposition", reason: "like-the" },
  { match: "a #Noun [like] (#Noun|#Determiner)", group: 0, tag: "Preposition", reason: "a-noun-like" },
  { match: "#Adverb [like]", group: 0, tag: "Verb", reason: "really-like" },
  { match: "(not|nothing|never) [like]", group: 0, tag: "Preposition", reason: "nothing-like" },
  { match: "#Infinitive #Pronoun [like]", group: 0, tag: "Preposition", reason: "treat-them-like" },
  { match: "[#QuestionWord] (#Pronoun|#Determiner)", group: 0, tag: "Preposition", reason: "how-he" },
  { match: "[#QuestionWord] #Participle", group: 0, tag: "Preposition", reason: "when-stolen" },
  { match: "[how] (#Determiner|#Copula|#Modal|#PastTense)", group: 0, tag: "QuestionWord", reason: "how-is" },
  { match: "#Plural [(who|which|when)] .", group: 0, tag: "Preposition", reason: "people-who" }
];
var expressions = [
  { match: "holy (shit|fuck|hell)", tag: "Expression", reason: "swears-expression" },
  { match: "^[(well|so|okay|now)] !#Adjective?", group: 0, tag: "Expression", reason: "well-" },
  { match: "^come on", tag: "Expression", reason: "come-on" },
  { match: "(say|says|said) [sorry]", group: 0, tag: "Expression", reason: "say-sorry" },
  { match: "^(ok|alright|shoot|hell|anyways)", tag: "Expression", reason: "ok-" },
  { match: "^(say && @hasComma)", tag: "Expression", reason: "say-" },
  { match: "^(like && @hasComma)", tag: "Expression", reason: "like-" },
  { match: "^[(dude|man|girl)] #Pronoun", group: 0, tag: "Expression", reason: "dude-i" }
];
let matches = [].concat(
  passive$1,
  adj,
  advAdj,
  gerundAdj,
  nounAdj,
  adv,
  ambigDates,
  dates,
  noun,
  gerundNouns,
  presNouns,
  money,
  fractions$1,
  numbers$2,
  person,
  personName,
  verbs$1,
  adjVerb,
  auxiliary,
  phrasal,
  imperative,
  adjGerund,
  misc$1,
  orgs$1,
  places$1,
  conjunctions,
  expressions
);
var model = {
  two: {
    matches
  }
};
let net$1 = null;
const postTagger = function(view) {
  const { world: world2 } = view;
  const { model: model2, methods: methods2 } = world2;
  net$1 = net$1 || methods2.one.buildNet(model2.two.matches, world2);
  let document2 = methods2.two.quickSplit(view.document);
  let ptrs = document2.map((terms) => {
    let t2 = terms[0];
    return [t2.index[0], t2.index[1], t2.index[1] + terms.length];
  });
  let m2 = view.update(ptrs);
  m2.cache();
  m2.sweep(net$1);
  view.uncache();
  return view;
};
const tagger = (view) => view.compute(["lexicon", "preTagger", "postTagger"]);
var compute$2 = { postTagger, tagger };
const round$1 = (n2) => Math.round(n2 * 100) / 100;
function api$o(View2) {
  View2.prototype.confidence = function() {
    let sum = 0;
    let count = 0;
    this.docs.forEach((terms) => {
      terms.forEach((term) => {
        count += 1;
        sum += term.confidence || 1;
      });
    });
    if (count === 0) {
      return 1;
    }
    return round$1(sum / count);
  };
  View2.prototype.tagger = function() {
    return this.compute(["tagger"]);
  };
}
const plugin$2 = {
  api: api$o,
  compute: compute$2,
  model,
  hooks: ["postTagger"]
};
var postTag = plugin$2;
const getWords = function(net2) {
  return Object.keys(net2.hooks).filter((w) => !w.startsWith("#") && !w.startsWith("%"));
};
const maybeMatch = function(doc, net2) {
  let words2 = getWords(net2);
  if (words2.length === 0) {
    return doc;
  }
  if (!doc._cache) {
    doc.cache();
  }
  let cache2 = doc._cache;
  return doc.filter((_m, i2) => {
    return words2.some((str) => cache2[i2].has(str));
  });
};
var maybeMatch$1 = maybeMatch;
const lazyParse = function(input, reg) {
  let net2 = reg;
  if (typeof reg === "string") {
    net2 = this.buildNet([{ match: reg }]);
  }
  let doc = this.tokenize(input);
  let m2 = maybeMatch$1(doc, net2);
  if (m2.found) {
    m2.compute(["index", "tagger"]);
    return m2.match(reg);
  }
  return doc.none();
};
var lazy$1 = lazyParse;
var lazy = {
  lib: {
    lazy: lazy$1
  }
};
const matchVerb = function(m2, lemma) {
  const conjugate2 = m2.methods.two.transform.verb.conjugate;
  let all2 = conjugate2(lemma, m2.model);
  if (m2.has("#Gerund")) {
    return all2.Gerund;
  }
  if (m2.has("#PastTense")) {
    return all2.PastTense;
  }
  if (m2.has("#PresentTense")) {
    return all2.PresentTense;
  }
  if (m2.has("#Gerund")) {
    return all2.Gerund;
  }
  return lemma;
};
const swapVerb = function(vb2, lemma) {
  let str = lemma;
  vb2.forEach((m2) => {
    if (!m2.has("#Infinitive")) {
      str = matchVerb(m2, lemma);
    }
    m2.replaceWith(str);
  });
  return vb2;
};
var swapVerb$1 = swapVerb;
const swapNoun = function(m2, lemma) {
  let str = lemma;
  if (m2.has("#Plural")) {
    const toPlural2 = m2.methods.two.transform.noun.toPlural;
    str = toPlural2(lemma, m2.model);
  }
  m2.replaceWith(str, { possessives: true });
};
const swapAdverb = function(m2, lemma) {
  const { toAdverb: toAdverb2 } = m2.methods.two.transform.adjective;
  let str = lemma;
  let adv2 = toAdverb2(str);
  if (adv2) {
    m2.replaceWith(adv2);
  }
};
const swapAdjective = function(m2, lemma) {
  const { toComparative: toComparative2, toSuperlative: toSuperlative2 } = m2.methods.two.transform.adjective;
  let str = lemma;
  if (m2.has("#Comparative")) {
    str = toComparative2(str, m2.model);
  } else if (m2.has("#Superlative")) {
    str = toSuperlative2(str, m2.model);
  }
  if (str) {
    m2.replaceWith(str);
  }
};
const swap$1 = function(from, to, tag2) {
  let reg = from.split(/ /g).map((str) => str.toLowerCase().trim());
  reg = reg.filter((str) => str);
  reg = reg.map((str) => `{${str}}`).join(" ");
  let m2 = this.match(reg);
  if (tag2) {
    m2 = m2.if(tag2);
  }
  if (m2.has("#Verb")) {
    return swapVerb$1(m2, to);
  }
  if (m2.has("#Noun")) {
    return swapNoun(m2, to);
  }
  if (m2.has("#Adverb")) {
    return swapAdverb(m2, to);
  }
  if (m2.has("#Adjective")) {
    return swapAdjective(m2, to);
  }
  return this;
};
var swap$2 = swap$1;
const api$n = function(View2) {
  View2.prototype.swap = swap$2;
};
var swap = {
  api: api$n
};
nlp$1.plugin(preTag);
nlp$1.plugin(contractionTwo);
nlp$1.plugin(postTag);
nlp$1.plugin(lazy);
nlp$1.plugin(swap);
const toRoot$1 = function(adj2) {
  const { fromComparative: fromComparative2, fromSuperlative: fromSuperlative2 } = adj2.methods.two.transform.adjective;
  let str = adj2.text("normal");
  if (adj2.has("#Comparative")) {
    return fromComparative2(str, adj2.model);
  }
  if (adj2.has("#Superlative")) {
    return fromSuperlative2(str, adj2.model);
  }
  return str;
};
const api$m = function(View2) {
  class Adjectives extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Adjectives";
    }
    json(opts2 = {}) {
      const { toAdverb: toAdverb2, toNoun: toNoun2, toSuperlative: toSuperlative2, toComparative: toComparative2 } = this.methods.two.transform.adjective;
      opts2.normal = true;
      return this.map((m2) => {
        let json2 = m2.toView().json(opts2)[0] || {};
        let str = toRoot$1(m2);
        json2.adjective = {
          adverb: toAdverb2(str, this.model),
          noun: toNoun2(str, this.model),
          superlative: toSuperlative2(str, this.model),
          comparative: toComparative2(str, this.model)
        };
        return json2;
      }, []);
    }
    adverbs() {
      return this.before("#Adverb+$").concat(this.after("^#Adverb+"));
    }
    conjugate(n2) {
      const { toComparative: toComparative2, toSuperlative: toSuperlative2, toNoun: toNoun2, toAdverb: toAdverb2 } = this.methods.two.transform.adjective;
      return this.getNth(n2).map((adj2) => {
        let root2 = toRoot$1(adj2);
        return {
          Adjective: root2,
          Comparative: toComparative2(root2, this.model),
          Superlative: toSuperlative2(root2, this.model),
          Noun: toNoun2(root2, this.model),
          Adverb: toAdverb2(root2, this.model)
        };
      }, []);
    }
    toComparative(n2) {
      const { toComparative: toComparative2 } = this.methods.two.transform.adjective;
      return this.getNth(n2).map((adj2) => {
        let root2 = toRoot$1(adj2);
        let str = toComparative2(root2, this.model);
        return adj2.replaceWith(str);
      });
    }
    toSuperlative(n2) {
      const { toSuperlative: toSuperlative2 } = this.methods.two.transform.adjective;
      return this.getNth(n2).map((adj2) => {
        let root2 = toRoot$1(adj2);
        let str = toSuperlative2(root2, this.model);
        return adj2.replaceWith(str);
      });
    }
    toAdverb(n2) {
      const { toAdverb: toAdverb2 } = this.methods.two.transform.adjective;
      return this.getNth(n2).map((adj2) => {
        let root2 = toRoot$1(adj2);
        let str = toAdverb2(root2, this.model);
        return adj2.replaceWith(str);
      });
    }
    toNoun(n2) {
      const { toNoun: toNoun2 } = this.methods.two.transform.adjective;
      return this.getNth(n2).map((adj2) => {
        let root2 = toRoot$1(adj2);
        let str = toNoun2(root2, this.model);
        return adj2.replaceWith(str);
      });
    }
  }
  View2.prototype.adjectives = function(n2) {
    let m2 = this.match("#Adjective");
    m2 = m2.getNth(n2);
    return new Adjectives(m2.document, m2.pointer);
  };
  View2.prototype.superlatives = function(n2) {
    let m2 = this.match("#Superlative");
    m2 = m2.getNth(n2);
    return new Adjectives(m2.document, m2.pointer);
  };
  View2.prototype.comparatives = function(n2) {
    let m2 = this.match("#Comparative");
    m2 = m2.getNth(n2);
    return new Adjectives(m2.document, m2.pointer);
  };
};
var adjectives = { api: api$m };
const toRoot = function(adj2) {
  let str = adj2.compute("root").text("root");
  return str;
};
const api$l = function(View2) {
  class Adverbs extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Adverbs";
    }
    conjugate(n2) {
      return this.getNth(n2).map((adv2) => {
        let adj2 = toRoot(adv2);
        return {
          Adverb: adv2.text("normal"),
          Adjective: adj2
        };
      }, []);
    }
    json(opts2 = {}) {
      const fromAdverb2 = this.methods.two.transform.adjective.fromAdverb;
      opts2.normal = true;
      return this.map((m2) => {
        let json2 = m2.toView().json(opts2)[0] || {};
        json2.adverb = {
          adjective: fromAdverb2(json2.normal)
        };
        return json2;
      }, []);
    }
  }
  View2.prototype.adverbs = function(n2) {
    let m2 = this.match("#Adverb");
    m2 = m2.getNth(n2);
    return new Adverbs(m2.document, m2.pointer);
  };
};
var adverbs = { api: api$l };
const byComma = function(doc) {
  let commas = doc.match("@hasComma");
  commas = commas.filter((m2) => {
    if (m2.growLeft(".").wordCount() === 1) {
      return false;
    }
    if (m2.growRight(". .").wordCount() === 1) {
      return false;
    }
    let more = m2.grow(".");
    more = more.ifNo("@hasComma @hasComma");
    more = more.ifNo("@hasComma (and|or) .");
    more = more.ifNo("(#City && @hasComma) #Country");
    more = more.ifNo("(#WeekDay && @hasComma) #Date");
    more = more.ifNo("(#Date+ && @hasComma) #Value");
    more = more.ifNo("(#Adjective && @hasComma) #Adjective");
    return more.found;
  });
  return doc.splitAfter(commas);
};
const splitParentheses = function(doc) {
  let matches2 = doc.parentheses();
  matches2 = matches2.filter((m2) => {
    return m2.wordCount() >= 3 && m2.has("#Verb") && m2.has("#Noun");
  });
  return doc.splitOn(matches2);
};
const splitQuotes = function(doc) {
  let matches2 = doc.quotations();
  matches2 = matches2.filter((m2) => {
    return m2.wordCount() >= 3 && m2.has("#Verb") && m2.has("#Noun");
  });
  return doc.splitOn(matches2);
};
const clauses = function(n2) {
  let found = this;
  found = splitParentheses(found);
  found = splitQuotes(found);
  found = byComma(found);
  found = found.splitAfter("(@hasEllipses|@hasSemicolon|@hasDash|@hasColon)");
  found = found.splitAfter("^#Pronoun (said|says)");
  found = found.splitBefore("(said|says) #ProperNoun$");
  found = found.splitBefore(". . if .{4}");
  found = found.splitBefore("and while");
  found = found.splitBefore("now that");
  found = found.splitBefore("ever since");
  found = found.splitBefore("(supposing|although)");
  found = found.splitBefore("even (while|if|though)");
  found = found.splitBefore("(whereas|whose)");
  found = found.splitBefore("as (though|if)");
  found = found.splitBefore("(til|until)");
  if (typeof n2 === "number") {
    found = found.get(n2);
  }
  return found;
};
var clauses$1 = clauses;
const chunks = function(doc) {
  let all2 = [];
  let lastOne = null;
  let m2 = doc.clauses();
  m2.docs.forEach((terms) => {
    terms.forEach((term) => {
      if (!term.chunk || term.chunk !== lastOne) {
        lastOne = term.chunk;
        all2.push([term.index[0], term.index[1], term.index[1] + 1]);
      } else {
        all2[all2.length - 1][2] = term.index[1] + 1;
      }
    });
    lastOne = null;
  });
  let parts = doc.update(all2);
  return parts;
};
var getChunks = chunks;
const api$j = function(View2) {
  class Chunks extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Chunks";
    }
    isVerb() {
      return this.filter((c2) => c2.has("<Verb>"));
    }
    isNoun() {
      return this.filter((c2) => c2.has("<Noun>"));
    }
    isAdjective() {
      return this.filter((c2) => c2.has("<Adjective>"));
    }
    isPivot() {
      return this.filter((c2) => c2.has("<Pivot>"));
    }
    debug() {
      this.toView().debug("chunks");
      return this;
    }
    update(pointer) {
      let m2 = new Chunks(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  View2.prototype.chunks = function(n2) {
    let m2 = getChunks(this);
    m2 = m2.getNth(n2);
    return new Chunks(this.document, m2.pointer);
  };
  View2.prototype.clauses = clauses$1;
};
var api$k = api$j;
const byWord = {
  this: "Noun",
  then: "Pivot"
};
const easyMode = function(document2) {
  for (let n2 = 0; n2 < document2.length; n2 += 1) {
    for (let t2 = 0; t2 < document2[n2].length; t2 += 1) {
      let term = document2[n2][t2];
      if (byWord.hasOwnProperty(term.normal) === true) {
        term.chunk = byWord[term.normal];
        continue;
      }
      if (term.tags.has("Verb")) {
        term.chunk = "Verb";
        continue;
      }
      if (term.tags.has("Noun") || term.tags.has("Determiner")) {
        term.chunk = "Noun";
        continue;
      }
      if (term.tags.has("Value")) {
        term.chunk = "Noun";
        continue;
      }
      if (term.tags.has("QuestionWord")) {
        term.chunk = "Pivot";
        continue;
      }
    }
  }
};
var easyMode$1 = easyMode;
const byNeighbour = function(document2) {
  for (let n2 = 0; n2 < document2.length; n2 += 1) {
    for (let t2 = 0; t2 < document2[n2].length; t2 += 1) {
      let term = document2[n2][t2];
      if (term.chunk) {
        continue;
      }
      let onRight = document2[n2][t2 + 1];
      let onLeft = document2[n2][t2 - 1];
      if (term.tags.has("Adjective")) {
        if (onLeft && onLeft.tags.has("Copula")) {
          term.chunk = "Adjective";
          continue;
        }
        if (onLeft && onLeft.tags.has("Determiner")) {
          term.chunk = "Noun";
          continue;
        }
        if (onRight && onRight.tags.has("Noun")) {
          term.chunk = "Noun";
          continue;
        }
        continue;
      }
      if (term.tags.has("Adverb") || term.tags.has("Negative")) {
        if (onLeft && onLeft.tags.has("Adjective")) {
          term.chunk = "Adjective";
          continue;
        }
        if (onLeft && onLeft.tags.has("Verb")) {
          term.chunk = "Verb";
          continue;
        }
        if (onRight && onRight.tags.has("Adjective")) {
          term.chunk = "Adjective";
          continue;
        }
        if (onRight && onRight.tags.has("Verb")) {
          term.chunk = "Verb";
          continue;
        }
      }
    }
  }
};
var byNeighbour$1 = byNeighbour;
const rules = [
  { match: "[that] #Determiner #Noun", group: 0, chunk: "Pivot" },
  { match: "#PastTense [that]", group: 0, chunk: "Pivot" },
  { match: "[so] #Determiner", group: 0, chunk: "Pivot" },
  { match: "#Copula #Adverb+? [#Adjective]", group: 0, chunk: "Adjective" },
  { match: "#Adjective and #Adjective", chunk: "Adjective" },
  { match: "#Adverb+ and #Adverb #Verb", chunk: "Verb" },
  { match: "#Gerund #Adjective$", chunk: "Verb" },
  { match: "#Gerund to #Verb", chunk: "Verb" },
  { match: "#PresentTense and #PresentTense", chunk: "Verb" },
  { match: "#Adverb #Negative", chunk: "Verb" },
  { match: "(want|wants|wanted) to #Infinitive", chunk: "Verb" },
  { match: "#Verb #Reflexive", chunk: "Verb" },
  { match: "#Verb [to] #Adverb? #Infinitive", group: 0, chunk: "Verb" },
  { match: "[#Preposition] #Gerund", group: 0, chunk: "Verb" },
  { match: "#Infinitive [that] <Noun>", group: 0, chunk: "Verb" },
  { match: "#Noun of #Determiner? #Noun", chunk: "Noun" },
  { match: "#Value+ #Adverb? #Adjective", chunk: "Noun" },
  { match: "the [#Adjective] #Noun", chunk: "Noun" },
  { match: "#Singular in #Determiner? #Singular", chunk: "Noun" },
  { match: "#Plural [in] #Determiner? #Noun", group: 0, chunk: "Pivot" },
  { match: "#Noun and #Determiner? #Noun", notIf: "(#Possessive|#Pronoun)", chunk: "Noun" }
];
let net = null;
const matcher = function(view, _2, world2) {
  const { methods: methods2 } = world2;
  net = net || methods2.one.buildNet(rules, world2);
  view.sweep(net);
};
var matcher$1 = matcher;
const setChunk = function(term, chunk) {
  const env2 = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
  if (env2.DEBUG_CHUNKS) {
    let str = (term.normal + "'").padEnd(8);
    console.log(`  | '${str}  \u2192  \x1B[34m${chunk.padEnd(12)}\x1B[0m \x1B[2m -fallback- \x1B[0m`);
  }
  term.chunk = chunk;
};
const fallback = function(document2) {
  for (let n2 = 0; n2 < document2.length; n2 += 1) {
    for (let t2 = 0; t2 < document2[n2].length; t2 += 1) {
      let term = document2[n2][t2];
      if (term.chunk === void 0) {
        if (term.tags.has("Conjunction")) {
          setChunk(term, "Pivot");
        } else if (term.tags.has("Preposition")) {
          setChunk(term, "Pivot");
        } else if (term.tags.has("Adverb")) {
          setChunk(term, "Verb");
        } else {
          term.chunk = "Noun";
        }
      }
    }
  }
};
var fallback$1 = fallback;
const fixUp = function(docs) {
  let byChunk = [];
  let current = null;
  docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let term = terms[i2];
      if (current && term.chunk === current) {
        byChunk[byChunk.length - 1].terms.push(term);
      } else {
        byChunk.push({ chunk: term.chunk, terms: [term] });
        current = term.chunk;
      }
    }
  });
  byChunk.forEach((c2) => {
    if (c2.chunk === "Verb") {
      const hasVerb = c2.terms.find((t2) => t2.tags.has("Verb"));
      if (!hasVerb) {
        c2.terms.forEach((t2) => t2.chunk = null);
      }
    }
  });
};
var fixUp$1 = fixUp;
const findChunks = function(view) {
  const { document: document2, world: world2 } = view;
  easyMode$1(document2);
  byNeighbour$1(document2);
  matcher$1(view, document2, world2);
  fallback$1(document2);
  fixUp$1(document2);
};
var compute$1 = { chunks: findChunks };
var chunker = {
  compute: compute$1,
  api: api$k,
  hooks: ["chunks"]
};
const hasPeriod = /\./g;
const api$i = function(View2) {
  class Acronyms extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Acronyms";
    }
    strip() {
      this.docs.forEach((terms) => {
        terms.forEach((term) => {
          term.text = term.text.replace(hasPeriod, "");
          term.normal = term.normal.replace(hasPeriod, "");
        });
      });
      return this;
    }
    addPeriods() {
      this.docs.forEach((terms) => {
        terms.forEach((term) => {
          term.text = term.text.replace(hasPeriod, "");
          term.normal = term.normal.replace(hasPeriod, "");
          term.text = term.text.split("").join(".") + ".";
          term.normal = term.normal.split("").join(".") + ".";
        });
      });
      return this;
    }
  }
  View2.prototype.acronyms = function(n2) {
    let m2 = this.match("#Acronym");
    m2 = m2.getNth(n2);
    return new Acronyms(m2.document, m2.pointer);
  };
};
var addAcronyms = api$i;
const hasOpen$1 = /\(/;
const hasClosed$1 = /\)/;
const findEnd$1 = function(terms, i2) {
  for (; i2 < terms.length; i2 += 1) {
    if (terms[i2].post && hasClosed$1.test(terms[i2].post)) {
      return i2;
    }
  }
  return null;
};
const find$b = function(doc) {
  let ptrs = [];
  doc.docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let term = terms[i2];
      if (term.pre && hasOpen$1.test(term.pre)) {
        let end2 = findEnd$1(terms, i2);
        if (end2 !== null) {
          let [n2, start2] = terms[i2].index;
          ptrs.push([n2, start2, end2 + 1, terms[i2].id]);
          i2 = end2;
        }
      }
    }
  });
  return doc.update(ptrs);
};
const strip$1 = function(m2) {
  m2.docs.forEach((terms) => {
    terms[0].pre = terms[0].pre.replace(hasOpen$1, "");
    let last = terms[terms.length - 1];
    last.post = last.post.replace(hasClosed$1, "");
  });
  return m2;
};
const api$h = function(View2) {
  class Parentheses extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Possessives";
    }
    strip() {
      return strip$1(this);
    }
  }
  View2.prototype.parentheses = function(n2) {
    let m2 = find$b(this);
    m2 = m2.getNth(n2);
    return new Parentheses(m2.document, m2.pointer);
  };
};
var addParentheses = api$h;
const apostropheS = /'s$/;
const find$a = function(doc) {
  let m2 = doc.match("#Possessive+");
  if (m2.has("#Person")) {
    m2 = m2.growLeft("#Person+");
  }
  if (m2.has("#Place")) {
    m2 = m2.growLeft("#Place+");
  }
  if (m2.has("#Organization")) {
    m2 = m2.growLeft("#Organization+");
  }
  return m2;
};
const api$g = function(View2) {
  class Possessives extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Possessives";
    }
    strip() {
      this.docs.forEach((terms) => {
        terms.forEach((term) => {
          term.text = term.text.replace(apostropheS, "");
          term.normal = term.normal.replace(apostropheS, "");
        });
      });
      return this;
    }
  }
  View2.prototype.possessives = function(n2) {
    let m2 = find$a(this);
    m2 = m2.getNth(n2);
    return new Possessives(m2.document, m2.pointer);
  };
};
var addPossessives = api$g;
const pairs = {
  '"': '"',
  "\uFF02": "\uFF02",
  "'": "'",
  "\u201C": "\u201D",
  "\u2018": "\u2019",
  "\u201F": "\u201D",
  "\u201B": "\u2019",
  "\u201E": "\u201D",
  "\u2E42": "\u201D",
  "\u201A": "\u2019",
  "\xAB": "\xBB",
  "\u2039": "\u203A",
  "\u2035": "\u2032",
  "\u2036": "\u2033",
  "\u2037": "\u2034",
  "\u301D": "\u301E",
  "`": "\xB4",
  "\u301F": "\u301E"
};
const hasOpen = RegExp("[" + Object.keys(pairs).join("") + "]");
const hasClosed = RegExp("[" + Object.values(pairs).join("") + "]");
const findEnd = function(terms, i2) {
  const have = terms[i2].pre.match(hasOpen)[0] || "";
  if (!have || !pairs[have]) {
    return null;
  }
  const want = pairs[have];
  for (; i2 < terms.length; i2 += 1) {
    if (terms[i2].post && terms[i2].post.match(want)) {
      return i2;
    }
  }
  return null;
};
const find$9 = function(doc) {
  let ptrs = [];
  doc.docs.forEach((terms) => {
    for (let i2 = 0; i2 < terms.length; i2 += 1) {
      let term = terms[i2];
      if (term.pre && hasOpen.test(term.pre)) {
        let end2 = findEnd(terms, i2);
        if (end2 !== null) {
          let [n2, start2] = terms[i2].index;
          ptrs.push([n2, start2, end2 + 1, terms[i2].id]);
          i2 = end2;
        }
      }
    }
  });
  return doc.update(ptrs);
};
const strip = function(m2) {
  m2.docs.forEach((terms) => {
    terms[0].pre = terms[0].pre.replace(hasOpen, "");
    let lastTerm = terms[terms.length - 1];
    lastTerm.post = lastTerm.post.replace(hasClosed, "");
  });
};
const api$f = function(View2) {
  class Quotations extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Possessives";
    }
    strip() {
      return strip(this);
    }
  }
  View2.prototype.quotations = function(n2) {
    let m2 = find$9(this);
    m2 = m2.getNth(n2);
    return new Quotations(m2.document, m2.pointer);
  };
};
var addQuotations = api$f;
const phoneNumbers = function(n2) {
  let m2 = this.splitAfter("@hasComma");
  m2 = m2.match("#PhoneNumber+");
  m2 = m2.getNth(n2);
  return m2;
};
const selections = [
  ["hyphenated", "@hasHyphen ."],
  ["hashTags", "#HashTag"],
  ["emails", "#Email"],
  ["emoji", "#Emoji"],
  ["emoticons", "#Emoticon"],
  ["atMentions", "#AtMention"],
  ["urls", "#Url"],
  ["conjunctions", "#Conjunction"],
  ["prepositions", "#Preposition"],
  ["abbreviations", "#Abbreviation"],
  ["honorifics", "#Honorific"]
];
let aliases = [
  ["emojis", "emoji"],
  ["atmentions", "atMentions"]
];
const addMethods = function(View2) {
  selections.forEach((a2) => {
    View2.prototype[a2[0]] = function(n2) {
      let m2 = this.match(a2[1]);
      return typeof n2 === "number" ? m2.get(n2) : m2;
    };
  });
  View2.prototype.phoneNumbers = phoneNumbers;
  aliases.forEach((a2) => {
    View2.prototype[a2[0]] = View2.prototype[a2[1]];
  });
};
var addSelections = addMethods;
var misc = {
  api: function(View2) {
    addAcronyms(View2);
    addParentheses(View2);
    addPossessives(View2);
    addQuotations(View2);
    addSelections(View2);
  }
};
const termLoop = function(view, cb) {
  view.docs.forEach((terms) => {
    terms.forEach(cb);
  });
};
var methods = {
  "case": (doc) => {
    termLoop(doc, (term) => {
      term.text = term.text.toLowerCase();
    });
  },
  "unicode": (doc) => {
    const world2 = doc.world;
    const killUnicode2 = world2.methods.one.killUnicode;
    termLoop(doc, (term) => term.text = killUnicode2(term.text, world2));
  },
  "whitespace": (doc) => {
    termLoop(doc, (term) => {
      term.post = term.post.replace(/\s+/g, " ");
      term.post = term.post.replace(/\s([.,?!:;])/g, "$1");
      term.pre = term.pre.replace(/\s+/g, "");
    });
  },
  "punctuation": (doc) => {
    termLoop(doc, (term) => {
      term.post = term.post.replace(/[–—-]/g, " ");
      term.post = term.post.replace(/[,:;]/g, "");
      term.post = term.post.replace(/\.{2,}/g, "");
      term.post = term.post.replace(/\?{2,}/g, "?");
      term.post = term.post.replace(/!{2,}/g, "!");
      term.post = term.post.replace(/\?!+/g, "?");
    });
    let docs = doc.docs;
    let terms = docs[docs.length - 1];
    if (terms && terms.length > 0) {
      let lastTerm = terms[terms.length - 1];
      lastTerm.post = lastTerm.post.replace(/ /g, "");
    }
  },
  "contractions": (doc) => {
    doc.contractions().expand();
  },
  "acronyms": (doc) => {
    doc.acronyms().strip();
  },
  "parentheses": (doc) => {
    doc.parentheses().strip();
  },
  "possessives": (doc) => {
    doc.possessives().strip();
  },
  "quotations": (doc) => {
    doc.quotations().strip();
  },
  "emoji": (doc) => {
    doc.emojis().remove();
  },
  "honorifics": (doc) => {
    doc.match("#Honorific+ #Person").honorifics().remove();
  },
  "adverbs": (doc) => {
    doc.adverbs().remove();
  },
  "nouns": (doc) => {
    doc.nouns().toSingular();
  },
  "verbs": (doc) => {
    doc.verbs().toInfinitive();
  },
  "numbers": (doc) => {
    doc.numbers().toNumber();
  },
  "debullet": (doc) => {
    const hasBullet = /^\s*([-–—*•])\s*$/;
    doc.docs.forEach((terms) => {
      if (hasBullet.test(terms[0].pre)) {
        terms[0].pre = terms[0].pre.replace(hasBullet, "");
      }
    });
    return doc;
  }
};
const split = (str) => {
  return str.split("|").reduce((h2, k2) => {
    h2[k2] = true;
    return h2;
  }, {});
};
const light = "unicode|punctuation|whitespace|acronyms";
const medium = "|case|contractions|parentheses|quotations|emoji|honorifics|debullet";
const heavy = "|possessives|adverbs|nouns|verbs";
const presets = {
  light: split(light),
  medium: split(light + medium),
  heavy: split(light + medium + heavy)
};
function api$e(View2) {
  View2.prototype.normalize = function(opts2 = "light") {
    if (typeof opts2 === "string") {
      opts2 = presets[opts2];
    }
    Object.keys(opts2).forEach((fn) => {
      if (methods.hasOwnProperty(fn)) {
        methods[fn](this, opts2[fn]);
      }
    });
    return this;
  };
}
var normalize = {
  api: api$e
};
const findNouns = function(doc) {
  let m2 = doc.clauses().match("<Noun>");
  let commas = m2.match("@hasComma");
  commas = commas.not("#Place");
  if (commas.found) {
    m2 = m2.splitAfter(commas);
  }
  m2 = m2.splitOn("#Expression");
  m2 = m2.splitOn("(he|she|we|you|they|i)");
  m2 = m2.splitOn("(#Noun|#Adjective) [(he|him|she|it)]", 0);
  m2 = m2.splitOn("[(he|him|she|it)] (#Determiner|#Value)", 0);
  m2 = m2.splitBefore("#Noun [(the|a|an)] #Adjective? #Noun", 0);
  m2 = m2.splitOn("[(here|there)] #Noun", 0);
  m2 = m2.splitOn("[#Noun] (here|there)", 0);
  m2 = m2.splitBefore("(our|my|their|your)");
  m2 = m2.splitOn("#Noun [#Determiner]", 0);
  m2 = m2.if("#Noun");
  return m2;
};
var find$8 = findNouns;
const list$1 = [
  "after",
  "although",
  "as if",
  "as long as",
  "as",
  "because",
  "before",
  "even if",
  "even though",
  "ever since",
  "if",
  "in order that",
  "provided that",
  "since",
  "so that",
  "than",
  "that",
  "though",
  "unless",
  "until",
  "what",
  "whatever",
  "when",
  "whenever",
  "where",
  "whereas",
  "wherever",
  "whether",
  "which",
  "whichever",
  "who",
  "whoever",
  "whom",
  "whomever",
  "whose"
];
const isSubordinate = function(m2) {
  if (m2.before("#Preposition$").found) {
    return true;
  }
  let leadIn = m2.before();
  if (!leadIn.found) {
    return false;
  }
  for (let i2 = 0; i2 < list$1.length; i2 += 1) {
    if (m2.has(list$1[i2])) {
      return true;
    }
  }
  return false;
};
var isSubordinate$1 = isSubordinate;
const notPlural = "(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)";
const isPlural$2 = function(m2, root2) {
  if (m2.has("#Plural")) {
    return true;
  }
  if (m2.has("#Noun and #Noun")) {
    return true;
  }
  if (m2.has("(we|they)")) {
    return true;
  }
  if (root2.has(notPlural) === true) {
    return false;
  }
  if (m2.has("#Singular")) {
    return false;
  }
  let str = root2.text("normal");
  return str.length > 3 && str.endsWith("s") && !str.endsWith("ss");
};
var isPlural$3 = isPlural$2;
const getRoot$1 = function(m2) {
  let tmp = m2.clone();
  tmp = tmp.match("#Noun+");
  tmp = tmp.remove("(#Adjective|#Preposition|#Determiner|#Value)");
  tmp = tmp.not("#Possessive");
  tmp = tmp.first();
  if (!tmp.found) {
    return m2;
  }
  return tmp;
};
const parseNoun = function(m2) {
  let root2 = getRoot$1(m2);
  return {
    determiner: m2.match("#Determiner").eq(0),
    adjectives: m2.match("#Adjective"),
    number: m2.values(),
    isPlural: isPlural$3(m2, root2),
    isSubordinate: isSubordinate$1(m2),
    root: root2
  };
};
var parseNoun$1 = parseNoun;
const toText$2 = (m2) => m2.text();
const toArray$1 = (m2) => m2.json({ terms: false, normal: true }).map((s2) => s2.normal);
const getNum = function(m2) {
  let num = null;
  if (!m2.found) {
    return num;
  }
  let val = m2.values(0);
  if (val.found) {
    let obj = val.parse()[0] || {};
    return obj.num;
  }
  return num;
};
const toJSON$2 = function(m2) {
  let res = parseNoun$1(m2);
  return {
    root: toText$2(res.root),
    number: getNum(res.number),
    determiner: toText$2(res.determiner),
    adjectives: toArray$1(res.adjectives),
    isPlural: res.isPlural,
    isSubordinate: res.isSubordinate
  };
};
var toJSON$3 = toJSON$2;
const hasPlural = function(root2) {
  if (root2.has("^(#Uncountable|#ProperNoun|#Place|#Pronoun|#Acronym)+$")) {
    return false;
  }
  return true;
};
var hasPlural$1 = hasPlural;
const keep$7 = { tags: true };
const nounToPlural = function(m2, parsed) {
  if (parsed.isPlural === true) {
    return m2;
  }
  if (parsed.root.has("#Possessive")) {
    parsed.root = parsed.root.possessives().strip();
  }
  if (!hasPlural$1(parsed.root)) {
    return m2;
  }
  const { methods: methods2, model: model2 } = m2.world;
  const { toPlural: toPlural2 } = methods2.two.transform.noun;
  let str = parsed.root.text({ keepPunct: false });
  let plural2 = toPlural2(str, model2);
  m2.match(parsed.root).replaceWith(plural2, keep$7).tag("Plural", "toPlural");
  if (parsed.determiner.has("(a|an)")) {
    m2.remove(parsed.determiner);
  }
  let copula = parsed.root.after("not? #Adverb+? [#Copula]", 0);
  if (copula.found) {
    if (copula.has("is")) {
      m2.replace(copula, "are");
    } else if (copula.has("was")) {
      m2.replace(copula, "were");
    }
  }
  return m2;
};
var toPlural = nounToPlural;
const keep$6 = { tags: true };
const nounToSingular = function(m2, parsed) {
  if (parsed.isPlural === false) {
    return m2;
  }
  const { methods: methods2, model: model2 } = m2.world;
  const { toSingular: toSingular2 } = methods2.two.transform.noun;
  let str = parsed.root.text("normal");
  let single = toSingular2(str, model2);
  m2.replace(parsed.root, single, keep$6).tag("Singular", "toPlural");
  return m2;
};
var toSingular = nounToSingular;
const api$c = function(View2) {
  class Nouns extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Nouns";
    }
    parse(n2) {
      return this.getNth(n2).map(parseNoun$1);
    }
    json(n2) {
      let opts2 = typeof n2 === "object" ? n2 : {};
      return this.getNth(n2).map((m2) => {
        let json2 = m2.toView().json(opts2)[0] || {};
        if (opts2 && opts2.noun !== true) {
          json2.noun = toJSON$3(m2);
        }
        return json2;
      }, []);
    }
    conjugate(n2) {
      const methods2 = this.world.methods.two.transform.noun;
      return this.getNth(n2).map((m2) => {
        let parsed = parseNoun$1(m2);
        let root2 = parsed.root.compute("root").text("root");
        let res = {
          Singular: root2
        };
        if (hasPlural$1(parsed.root)) {
          res.Plural = methods2.toPlural(root2, this.model);
        }
        if (res.Singular === res.Plural) {
          delete res.Plural;
        }
        return res;
      }, []);
    }
    isPlural(n2) {
      let res = this.filter((m2) => parseNoun$1(m2).isPlural);
      return res.getNth(n2);
    }
    isSingular(n2) {
      let res = this.filter((m2) => !parseNoun$1(m2).isPlural);
      return res.getNth(n2);
    }
    adjectives(n2) {
      let res = this.update([]);
      this.forEach((m2) => {
        let adj2 = parseNoun$1(m2).adjectives;
        if (adj2.found) {
          res = res.concat(adj2);
        }
      });
      return res.getNth(n2);
    }
    toPlural(n2) {
      return this.getNth(n2).map((m2) => {
        return toPlural(m2, parseNoun$1(m2));
      });
    }
    toSingular(n2) {
      return this.getNth(n2).map((m2) => {
        let res = parseNoun$1(m2);
        return toSingular(m2, res);
      });
    }
    update(pointer) {
      let m2 = new Nouns(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  View2.prototype.nouns = function(n2) {
    let m2 = find$8(this);
    m2 = m2.getNth(n2);
    return new Nouns(this.document, m2.pointer);
  };
};
var api$d = api$c;
var nouns = {
  api: api$d
};
const findFractions = function(doc, n2) {
  let m2 = doc.match("#Fraction+");
  m2 = m2.filter((r2) => {
    return !r2.lookBehind("#Value and$").found;
  });
  m2 = m2.notIf("#Value seconds");
  if (typeof n2 === "number") {
    m2 = m2.eq(n2);
  }
  return m2;
};
var find$7 = findFractions;
const findModifiers = (str) => {
  const mults = [
    {
      reg: /^(minus|negative)[\s-]/i,
      mult: -1
    },
    {
      reg: /^(a\s)?half[\s-](of\s)?/i,
      mult: 0.5
    }
  ];
  for (let i2 = 0; i2 < mults.length; i2++) {
    if (mults[i2].reg.test(str) === true) {
      return {
        amount: mults[i2].mult,
        str: str.replace(mults[i2].reg, "")
      };
    }
  }
  return {
    amount: 1,
    str
  };
};
var findModifiers$1 = findModifiers;
var words = {
  ones: {
    zeroth: 0,
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  },
  teens: {
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19
  },
  tens: {
    twentieth: 20,
    thirtieth: 30,
    fortieth: 40,
    fourtieth: 40,
    fiftieth: 50,
    sixtieth: 60,
    seventieth: 70,
    eightieth: 80,
    ninetieth: 90,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fourty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90
  },
  multiples: {
    hundredth: 100,
    thousandth: 1e3,
    millionth: 1e6,
    billionth: 1e9,
    trillionth: 1e12,
    quadrillionth: 1e15,
    quintillionth: 1e18,
    sextillionth: 1e21,
    septillionth: 1e24,
    hundred: 100,
    thousand: 1e3,
    million: 1e6,
    billion: 1e9,
    trillion: 1e12,
    quadrillion: 1e15,
    quintillion: 1e18,
    sextillion: 1e21,
    septillion: 1e24,
    grand: 1e3
  }
};
const isValid = (w, has2) => {
  if (words.ones.hasOwnProperty(w)) {
    if (has2.ones || has2.teens) {
      return false;
    }
  } else if (words.teens.hasOwnProperty(w)) {
    if (has2.ones || has2.teens || has2.tens) {
      return false;
    }
  } else if (words.tens.hasOwnProperty(w)) {
    if (has2.ones || has2.teens || has2.tens) {
      return false;
    }
  }
  return true;
};
var isValid$1 = isValid;
const parseDecimals = function(arr) {
  let str = "0.";
  for (let i2 = 0; i2 < arr.length; i2++) {
    let w = arr[i2];
    if (words.ones.hasOwnProperty(w) === true) {
      str += words.ones[w];
    } else if (words.teens.hasOwnProperty(w) === true) {
      str += words.teens[w];
    } else if (words.tens.hasOwnProperty(w) === true) {
      str += words.tens[w];
    } else if (/^[0-9]$/.test(w) === true) {
      str += w;
    } else {
      return 0;
    }
  }
  return parseFloat(str);
};
var parseDecimals$1 = parseDecimals;
const parseNumeric$1 = (str) => {
  str = str.replace(/1st$/, "1");
  str = str.replace(/2nd$/, "2");
  str = str.replace(/3rd$/, "3");
  str = str.replace(/([4567890])r?th$/, "$1");
  str = str.replace(/^[$€¥£¢]/, "");
  str = str.replace(/[%$€¥£¢]$/, "");
  str = str.replace(/,/g, "");
  str = str.replace(/([0-9])([a-z\u00C0-\u00FF]{1,2})$/, "$1");
  return str;
};
var parseNumeric$2 = parseNumeric$1;
const improperFraction = /^([0-9,. ]+)\/([0-9,. ]+)$/;
const casualForms = {
  "a few": 3,
  "a couple": 2,
  "a dozen": 12,
  "two dozen": 24,
  zero: 0
};
const section_sum = (obj) => {
  return Object.keys(obj).reduce((sum, k2) => {
    sum += obj[k2];
    return sum;
  }, 0);
};
const parse$5 = function(str) {
  if (casualForms.hasOwnProperty(str) === true) {
    return casualForms[str];
  }
  if (str === "a" || str === "an") {
    return 1;
  }
  const modifier = findModifiers$1(str);
  str = modifier.str;
  let last_mult = null;
  let has2 = {};
  let sum = 0;
  let isNegative = false;
  const terms = str.split(/[ -]/);
  for (let i2 = 0; i2 < terms.length; i2++) {
    let w = terms[i2];
    w = parseNumeric$2(w);
    if (!w || w === "and") {
      continue;
    }
    if (w === "-" || w === "negative") {
      isNegative = true;
      continue;
    }
    if (w.charAt(0) === "-") {
      isNegative = true;
      w = w.substring(1);
    }
    if (w === "point") {
      sum += section_sum(has2);
      sum += parseDecimals$1(terms.slice(i2 + 1, terms.length));
      sum *= modifier.amount;
      return sum;
    }
    const fm = w.match(improperFraction);
    if (fm) {
      const num = parseFloat(fm[1].replace(/[, ]/g, ""));
      const denom = parseFloat(fm[2].replace(/[, ]/g, ""));
      if (denom) {
        sum += num / denom || 0;
      }
      continue;
    }
    if (words.tens.hasOwnProperty(w)) {
      if (has2.ones && Object.keys(has2).length === 1) {
        sum = has2.ones * 100;
        has2 = {};
      }
    }
    if (isValid$1(w, has2) === false) {
      return null;
    }
    if (/^[0-9.]+$/.test(w)) {
      has2.ones = parseFloat(w);
    } else if (words.ones.hasOwnProperty(w) === true) {
      has2.ones = words.ones[w];
    } else if (words.teens.hasOwnProperty(w) === true) {
      has2.teens = words.teens[w];
    } else if (words.tens.hasOwnProperty(w) === true) {
      has2.tens = words.tens[w];
    } else if (words.multiples.hasOwnProperty(w) === true) {
      let mult = words.multiples[w];
      if (mult === last_mult) {
        return null;
      }
      if (mult === 100 && terms[i2 + 1] !== void 0) {
        const w2 = terms[i2 + 1];
        if (words.multiples[w2]) {
          mult *= words.multiples[w2];
          i2 += 1;
        }
      }
      if (last_mult === null || mult < last_mult) {
        sum += (section_sum(has2) || 1) * mult;
        last_mult = mult;
        has2 = {};
      } else {
        sum += section_sum(has2);
        last_mult = mult;
        sum = (sum || 1) * mult;
        has2 = {};
      }
    }
  }
  sum += section_sum(has2);
  sum *= modifier.amount;
  sum *= isNegative ? -1 : 1;
  if (sum === 0 && Object.keys(has2).length === 0) {
    return null;
  }
  return sum;
};
var parseText = parse$5;
const endS = /s$/;
const parseNumber$1 = function(m2) {
  let str = m2.text("reduced");
  return parseText(str);
};
let mapping = {
  half: 2,
  halve: 2,
  quarter: 4
};
const slashForm = function(m2) {
  let str = m2.text("reduced");
  let found = str.match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
  if (found && found[1] && found[0]) {
    return {
      numerator: Number(found[1]),
      denominator: Number(found[2])
    };
  }
  return null;
};
const nOutOfN = function(m2) {
  let found = m2.match("[<num>#Value+] out of every? [<den>#Value+]");
  if (found.found !== true) {
    return null;
  }
  let { num, den } = found.groups();
  if (!num || !den) {
    return null;
  }
  num = parseNumber$1(num);
  den = parseNumber$1(den);
  if (!num || !den) {
    return null;
  }
  if (typeof num === "number" && typeof den === "number") {
    return {
      numerator: num,
      denominator: den
    };
  }
  return null;
};
const nOrinalth = function(m2) {
  let found = m2.match("[<num>(#Cardinal|a)+] [<den>#Fraction+]");
  if (found.found !== true) {
    return null;
  }
  let { num, den } = found.groups();
  if (num.has("a")) {
    num = 1;
  } else {
    num = parseNumber$1(num);
  }
  let str = den.text("reduced");
  if (endS.test(str)) {
    str = str.replace(endS, "");
    den = den.replaceWith(str);
  }
  if (mapping.hasOwnProperty(str)) {
    den = mapping[str];
  } else {
    den = parseNumber$1(den);
  }
  if (typeof num === "number" && typeof den === "number") {
    return {
      numerator: num,
      denominator: den
    };
  }
  return null;
};
const oneNth = function(m2) {
  let found = m2.match("^#Ordinal$");
  if (found.found !== true) {
    return null;
  }
  if (m2.lookAhead("^of .")) {
    let num = parseNumber$1(found);
    return {
      numerator: 1,
      denominator: num
    };
  }
  return null;
};
const named = function(m2) {
  let str = m2.text("reduced");
  if (mapping.hasOwnProperty(str)) {
    return { numerator: 1, denominator: mapping[str] };
  }
  return null;
};
const round = (n2) => {
  let rounded = Math.round(n2 * 1e3) / 1e3;
  if (rounded === 0 && n2 !== 0) {
    return n2;
  }
  return rounded;
};
const parseFraction = function(m2) {
  m2 = m2.clone();
  let res = named(m2) || slashForm(m2) || nOutOfN(m2) || nOrinalth(m2) || oneNth(m2) || null;
  if (res !== null) {
    if (res.numerator && res.denominator) {
      res.decimal = res.numerator / res.denominator;
      res.decimal = round(res.decimal);
    }
  }
  return res;
};
var parseFraction$1 = parseFraction;
const numToString = function(n2) {
  if (n2 < 1e6) {
    return String(n2);
  }
  let str;
  if (typeof n2 === "number") {
    str = n2.toFixed(0);
  } else {
    str = n2;
  }
  if (str.indexOf("e+") === -1) {
    return str;
  }
  return str.replace(".", "").split("e+").reduce(function(p2, b) {
    return p2 + Array(b - p2.length + 2).join(0);
  });
};
var toString = numToString;
const tens_mapping = [
  ["ninety", 90],
  ["eighty", 80],
  ["seventy", 70],
  ["sixty", 60],
  ["fifty", 50],
  ["forty", 40],
  ["thirty", 30],
  ["twenty", 20]
];
const ones_mapping = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen"
];
const sequence = [
  [1e24, "septillion"],
  [1e20, "hundred sextillion"],
  [1e21, "sextillion"],
  [1e20, "hundred quintillion"],
  [1e18, "quintillion"],
  [1e17, "hundred quadrillion"],
  [1e15, "quadrillion"],
  [1e14, "hundred trillion"],
  [1e12, "trillion"],
  [1e11, "hundred billion"],
  [1e9, "billion"],
  [1e8, "hundred million"],
  [1e6, "million"],
  [1e5, "hundred thousand"],
  [1e3, "thousand"],
  [100, "hundred"],
  [1, "one"]
];
const breakdown_magnitudes = function(num) {
  let working = num;
  let have = [];
  sequence.forEach((a2) => {
    if (num >= a2[0]) {
      let howmany = Math.floor(working / a2[0]);
      working -= howmany * a2[0];
      if (howmany) {
        have.push({
          unit: a2[1],
          count: howmany
        });
      }
    }
  });
  return have;
};
const breakdown_hundred = function(num) {
  let arr = [];
  if (num > 100) {
    return arr;
  }
  for (let i2 = 0; i2 < tens_mapping.length; i2++) {
    if (num >= tens_mapping[i2][1]) {
      num -= tens_mapping[i2][1];
      arr.push(tens_mapping[i2][0]);
    }
  }
  if (ones_mapping[num]) {
    arr.push(ones_mapping[num]);
  }
  return arr;
};
const handle_decimal = (num) => {
  const names2 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  let arr = [];
  let str = toString(num);
  let decimal = str.match(/\.([0-9]+)/);
  if (!decimal || !decimal[0]) {
    return arr;
  }
  arr.push("point");
  let decimals = decimal[0].split("");
  for (let i2 = 0; i2 < decimals.length; i2++) {
    arr.push(names2[decimals[i2]]);
  }
  return arr;
};
const toText$1 = function(obj) {
  let num = obj.num;
  if (num === 0 || num === "0") {
    return "zero";
  }
  if (num > 1e21) {
    num = toString(num);
  }
  let arr = [];
  if (num < 0) {
    arr.push("minus");
    num = Math.abs(num);
  }
  let units2 = breakdown_magnitudes(num);
  for (let i2 = 0; i2 < units2.length; i2++) {
    let unit_name = units2[i2].unit;
    if (unit_name === "one") {
      unit_name = "";
      if (arr.length > 1) {
        arr.push("and");
      }
    }
    arr = arr.concat(breakdown_hundred(units2[i2].count));
    arr.push(unit_name);
  }
  arr = arr.concat(handle_decimal(num));
  arr = arr.filter((s2) => s2);
  if (arr.length === 0) {
    arr[0] = "";
  }
  return arr.join(" ");
};
var textCardinal = toText$1;
const toCardinal = function(obj) {
  if (!obj.numerator || !obj.denominator) {
    return "";
  }
  let a2 = textCardinal({ num: obj.numerator });
  let b = textCardinal({ num: obj.denominator });
  return `${a2} out of ${b}`;
};
var toCardinal$1 = toCardinal;
const irregulars = {
  one: "first",
  two: "second",
  three: "third",
  five: "fifth",
  eight: "eighth",
  nine: "ninth",
  twelve: "twelfth",
  twenty: "twentieth",
  thirty: "thirtieth",
  forty: "fortieth",
  fourty: "fourtieth",
  fifty: "fiftieth",
  sixty: "sixtieth",
  seventy: "seventieth",
  eighty: "eightieth",
  ninety: "ninetieth"
};
const textOrdinal = (obj) => {
  let words2 = textCardinal(obj).split(" ");
  let last = words2[words2.length - 1];
  if (irregulars.hasOwnProperty(last)) {
    words2[words2.length - 1] = irregulars[last];
  } else {
    words2[words2.length - 1] = last.replace(/y$/, "i") + "th";
  }
  return words2.join(" ");
};
var textOrdinal$1 = textOrdinal;
const toOrdinal = function(obj) {
  if (!obj.numerator || !obj.denominator) {
    return "";
  }
  let start2 = textCardinal({ num: obj.numerator });
  let end2 = textOrdinal$1({ num: obj.denominator });
  if (obj.denominator === 2) {
    end2 = "half";
  }
  if (start2 && end2) {
    if (obj.numerator !== 1) {
      end2 += "s";
    }
    return `${start2} ${end2}`;
  }
  return "";
};
var toOrdinal$1 = toOrdinal;
const plugin$1 = function(View2) {
  class Fractions extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Fractions";
    }
    parse(n2) {
      return this.getNth(n2).map(parseFraction$1);
    }
    get(n2) {
      return this.getNth(n2).map(parseFraction$1);
    }
    json(n2) {
      return this.getNth(n2).map((p2) => {
        let json2 = p2.toView().json(n2)[0];
        let parsed = parseFraction$1(p2);
        json2.fraction = parsed;
        return json2;
      }, []);
    }
    toDecimal(n2) {
      this.getNth(n2).forEach((m2) => {
        let { decimal } = parseFraction$1(m2);
        m2 = m2.replaceWith(String(decimal), true);
        m2.tag("NumericValue");
        m2.unTag("Fraction");
      });
      return this;
    }
    toFraction(n2) {
      this.getNth(n2).forEach((m2) => {
        let obj = parseFraction$1(m2);
        if (obj && typeof obj.numerator === "number" && typeof obj.denominator === "number") {
          let str = `${obj.numerator}/${obj.denominator}`;
          this.replace(m2, str);
        }
      });
      return this;
    }
    toOrdinal(n2) {
      this.getNth(n2).forEach((m2) => {
        let obj = parseFraction$1(m2);
        let str = toOrdinal$1(obj);
        if (m2.after("^#Noun").found) {
          str += " of";
        }
        m2.replaceWith(str);
      });
      return this;
    }
    toCardinal(n2) {
      this.getNth(n2).forEach((m2) => {
        let obj = parseFraction$1(m2);
        let str = toCardinal$1(obj);
        m2.replaceWith(str);
      });
      return this;
    }
    toPercentage(n2) {
      this.getNth(n2).forEach((m2) => {
        let { decimal } = parseFraction$1(m2);
        let percent = decimal * 100;
        percent = Math.round(percent * 100) / 100;
        m2.replaceWith(`${percent}%`);
      });
      return this;
    }
  }
  View2.prototype.fractions = function(n2) {
    let m2 = find$7(this);
    m2 = m2.getNth(n2);
    return new Fractions(this.document, m2.pointer);
  };
};
var fractions = plugin$1;
const ones$1 = "one|two|three|four|five|six|seven|eight|nine";
const tens = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty";
const teens = "eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen";
const findNumbers = function(doc) {
  let m2 = doc.match("#Value+");
  if (m2.has("#NumericValue #NumericValue")) {
    if (m2.has("#Value @hasComma #Value")) {
      m2.splitAfter("@hasComma");
    } else if (m2.has("#NumericValue #Fraction")) {
      m2.splitAfter("#NumericValue #Fraction");
    } else {
      m2 = m2.splitAfter("#NumericValue");
    }
  }
  if (m2.has("#Value #Value #Value") && !m2.has("#Multiple")) {
    if (m2.has("(" + tens + ") #Cardinal #Cardinal")) {
      m2 = m2.splitAfter("(" + tens + ") #Cardinal");
    }
  }
  if (m2.has("#Value #Value")) {
    if (m2.has("#NumericValue #NumericValue")) {
      m2 = m2.splitOn("#Year");
    }
    if (m2.has("(" + tens + ") (" + teens + ")")) {
      m2 = m2.splitAfter("(" + tens + ")");
    }
    let double = m2.match("#Cardinal #Cardinal");
    if (double.found && !m2.has("(point|decimal|#Fraction)")) {
      if (!double.has("#Cardinal (#Multiple|point|decimal)")) {
        let noMultiple = m2.has(`(${ones$1}) (${tens})`);
        let tensVal = double.has("(" + tens + ") #Cardinal");
        let multVal = double.has("#Multiple #Value");
        if (!noMultiple && !tensVal && !multVal) {
          double.terms().forEach((d2) => {
            m2 = m2.splitOn(d2);
          });
        }
      }
    }
    if (m2.match("#Ordinal #Ordinal").match("#TextValue").found && !m2.has("#Multiple")) {
      if (!m2.has("(" + tens + ") #Ordinal")) {
        m2 = m2.splitAfter("#Ordinal");
      }
    }
    m2 = m2.splitBefore("#Ordinal [#Cardinal]", 0);
    if (m2.has("#TextValue #NumericValue") && !m2.has("(" + tens + "|#Multiple)")) {
      m2 = m2.splitBefore("#TextValue #NumericValue");
    }
  }
  m2 = m2.splitAfter("#NumberRange");
  m2 = m2.splitBefore("#Year");
  return m2;
};
var find$6 = findNumbers;
const parseNumeric = function(str, m2) {
  str = str.replace(/,/g, "");
  let arr = str.split(/([0-9.,]*)/);
  let [prefix2, num] = arr;
  let suffix = arr.slice(2).join("");
  if (num !== "" && m2.length < 2) {
    num = Number(num || str);
    if (typeof num !== "number") {
      num = null;
    }
    suffix = suffix || "";
    if (suffix === "st" || suffix === "nd" || suffix === "rd" || suffix === "th") {
      suffix = "";
    }
    return {
      prefix: prefix2 || "",
      num,
      suffix
    };
  }
  return null;
};
const parseNumber = function(m2) {
  if (typeof m2 === "string") {
    return { num: parseText(m2) };
  }
  let str = m2.text("reduced");
  let unit = m2.growRight("#Unit").match("#Unit$").text("machine");
  let hasComma = /[0-9],[0-9]/.test(m2.text("text"));
  if (m2.terms().length === 1 && !m2.has("#Multiple")) {
    let res = parseNumeric(str, m2);
    if (res !== null) {
      res.hasComma = hasComma;
      res.unit = unit;
      return res;
    }
  }
  let frPart = m2.match("#Fraction{2,}$");
  frPart = frPart.found === false ? m2.match("^#Fraction$") : frPart;
  let fraction = null;
  if (frPart.found) {
    if (frPart.has("#Value and #Value #Fraction")) {
      frPart = frPart.match("and #Value #Fraction");
    }
    fraction = parseFraction$1(frPart);
    m2 = m2.not(frPart);
    m2 = m2.not("and$");
    str = m2.text("reduced");
  }
  let num = 0;
  if (str) {
    num = parseText(str) || 0;
  }
  if (fraction && fraction.decimal) {
    num += fraction.decimal;
  }
  return {
    hasComma,
    prefix: "",
    num,
    suffix: "",
    isOrdinal: m2.has("#Ordinal"),
    isText: m2.has("#TextValue"),
    isFraction: m2.has("#Fraction"),
    isMoney: m2.has("#Money"),
    unit
  };
};
var parse$4 = parseNumber;
const numOrdinal = function(obj) {
  let num = obj.num;
  if (!num && num !== 0) {
    return null;
  }
  let tens2 = num % 100;
  if (tens2 > 10 && tens2 < 20) {
    return String(num) + "th";
  }
  const mapping2 = {
    0: "th",
    1: "st",
    2: "nd",
    3: "rd"
  };
  let str = toString(num);
  let last = str.slice(str.length - 1, str.length);
  if (mapping2[last]) {
    str += mapping2[last];
  } else {
    str += "th";
  }
  return str;
};
var numOrdinal$1 = numOrdinal;
const prefixes = {
  "\xA2": "cents",
  $: "dollars",
  "\xA3": "pounds",
  "\xA5": "yen",
  "\u20AC": "euros",
  "\u20A1": "col\xF3n",
  "\u0E3F": "baht",
  "\u20AD": "kip",
  "\u20A9": "won",
  "\u20B9": "rupees",
  "\u20BD": "ruble",
  "\u20BA": "liras"
};
const suffixes = {
  "%": "percent",
  "\xB0": "degrees"
};
const addSuffix = function(obj) {
  let res = {
    suffix: "",
    prefix: obj.prefix
  };
  if (prefixes.hasOwnProperty(obj.prefix)) {
    res.suffix += " " + prefixes[obj.prefix];
    res.prefix = "";
  }
  if (suffixes.hasOwnProperty(obj.suffix)) {
    res.suffix += " " + suffixes[obj.suffix];
  }
  if (res.suffix && obj.num === 1) {
    res.suffix = res.suffix.replace(/s$/, "");
  }
  if (!res.suffix && obj.suffix) {
    res.suffix += " " + obj.suffix;
  }
  return res;
};
var makeSuffix = addSuffix;
const format = function(obj, fmt2) {
  if (fmt2 === "TextOrdinal") {
    let { prefix: prefix2, suffix } = makeSuffix(obj);
    return prefix2 + textOrdinal$1(obj) + suffix;
  }
  if (fmt2 === "Ordinal") {
    return obj.prefix + numOrdinal$1(obj) + obj.suffix;
  }
  if (fmt2 === "TextCardinal") {
    let { prefix: prefix2, suffix } = makeSuffix(obj);
    return prefix2 + textCardinal(obj) + suffix;
  }
  let num = obj.num;
  if (obj.hasComma) {
    num = num.toLocaleString();
  }
  return obj.prefix + String(num) + obj.suffix;
};
var format$1 = format;
const addMethod$2 = function(View2) {
  class Numbers extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Numbers";
    }
    parse(n2) {
      return this.getNth(n2).map(parse$4);
    }
    get(n2) {
      return this.getNth(n2).map(parse$4).map((o2) => o2.num);
    }
    json(n2) {
      let opts2 = typeof n2 === "object" ? n2 : {};
      return this.getNth(n2).map((p2) => {
        let json2 = p2.toView().json(opts2)[0];
        let parsed = parse$4(p2);
        json2.number = {
          prefix: parsed.prefix,
          num: parsed.num,
          suffix: parsed.suffix,
          hasComma: parsed.hasComma,
          unit: parsed.unit
        };
        return json2;
      }, []);
    }
    units() {
      return this.growRight("#Unit").match("#Unit$");
    }
    isOrdinal() {
      return this.if("#Ordinal");
    }
    isCardinal() {
      return this.if("#Cardinal");
    }
    toNumber() {
      let m2 = this.if("#TextValue");
      m2.forEach((val) => {
        let obj = parse$4(val);
        if (obj.num === null) {
          return;
        }
        let fmt2 = val.has("#Ordinal") ? "Ordinal" : "Cardinal";
        let str = format$1(obj, fmt2);
        val.replaceWith(str, { tags: true });
        val.tag("NumericValue");
      });
      return this;
    }
    toLocaleString() {
      let m2 = this;
      m2.forEach((val) => {
        let obj = parse$4(val);
        if (obj.num === null) {
          return;
        }
        let num = obj.num.toLocaleString();
        if (val.has("#Ordinal")) {
          let str = format$1(obj, "Ordinal");
          let end2 = str.match(/[a-z]+$/);
          if (end2) {
            num += end2[0] || "";
          }
        }
        val.replaceWith(num, { tags: true });
      });
      return this;
    }
    toText() {
      let m2 = this;
      let res = m2.map((val) => {
        if (val.has("#TextValue")) {
          return val;
        }
        let obj = parse$4(val);
        if (obj.num === null) {
          return val;
        }
        let fmt2 = val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal";
        let str = format$1(obj, fmt2);
        val.replaceWith(str, { tags: true });
        val.tag("TextValue");
        return val;
      });
      return new Numbers(res.document, res.pointer);
    }
    toCardinal() {
      let m2 = this;
      let res = m2.map((val) => {
        if (!val.has("#Ordinal")) {
          return val;
        }
        let obj = parse$4(val);
        if (obj.num === null) {
          return val;
        }
        let fmt2 = val.has("#TextValue") ? "TextCardinal" : "Cardinal";
        let str = format$1(obj, fmt2);
        val.replaceWith(str, { tags: true });
        val.tag("Cardinal");
        return val;
      });
      return new Numbers(res.document, res.pointer);
    }
    toOrdinal() {
      let m2 = this;
      let res = m2.map((val) => {
        if (val.has("#Ordinal")) {
          return val;
        }
        let obj = parse$4(val);
        if (obj.num === null) {
          return val;
        }
        let fmt2 = val.has("#TextValue") ? "TextOrdinal" : "Ordinal";
        let str = format$1(obj, fmt2);
        val.replaceWith(str, { tags: true });
        val.tag("Ordinal");
        return val;
      });
      return new Numbers(res.document, res.pointer);
    }
    isEqual(n2) {
      return this.filter((val) => {
        let num = parse$4(val).num;
        return num === n2;
      });
    }
    greaterThan(n2) {
      return this.filter((val) => {
        let num = parse$4(val).num;
        return num > n2;
      });
    }
    lessThan(n2) {
      return this.filter((val) => {
        let num = parse$4(val).num;
        return num < n2;
      });
    }
    between(min2, max2) {
      return this.filter((val) => {
        let num = parse$4(val).num;
        return num > min2 && num < max2;
      });
    }
    set(n2) {
      if (n2 === void 0) {
        return this;
      }
      if (typeof n2 === "string") {
        n2 = parse$4(n2).num;
      }
      let m2 = this;
      let res = m2.map((val) => {
        let obj = parse$4(val);
        obj.num = n2;
        if (obj.num === null) {
          return val;
        }
        let fmt2 = val.has("#Ordinal") ? "Ordinal" : "Cardinal";
        if (val.has("#TextValue")) {
          fmt2 = val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal";
        }
        let str = format$1(obj, fmt2);
        if (obj.hasComma && fmt2 === "Cardinal") {
          str = Number(str).toLocaleString();
        }
        val = val.not("#Currency");
        val.replaceWith(str, { tags: true });
        return val;
      });
      return new Numbers(res.document, res.pointer);
    }
    add(n2) {
      if (!n2) {
        return this;
      }
      if (typeof n2 === "string") {
        n2 = parse$4(n2).num;
      }
      let m2 = this;
      let res = m2.map((val) => {
        let obj = parse$4(val);
        if (obj.num === null) {
          return val;
        }
        obj.num += n2;
        let fmt2 = val.has("#Ordinal") ? "Ordinal" : "Cardinal";
        if (obj.isText) {
          fmt2 = val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal";
        }
        let str = format$1(obj, fmt2);
        val.replaceWith(str, { tags: true });
        return val;
      });
      return new Numbers(res.document, res.pointer);
    }
    subtract(n2, agree) {
      return this.add(n2 * -1, agree);
    }
    increment(agree) {
      return this.add(1, agree);
    }
    decrement(agree) {
      return this.add(-1, agree);
    }
    update(pointer) {
      let m2 = new Numbers(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  Numbers.prototype.toNice = Numbers.prototype.toLocaleString;
  Numbers.prototype.isBetween = Numbers.prototype.between;
  Numbers.prototype.minus = Numbers.prototype.subtract;
  Numbers.prototype.plus = Numbers.prototype.add;
  Numbers.prototype.equals = Numbers.prototype.isEqual;
  View2.prototype.numbers = function(n2) {
    let m2 = find$6(this);
    m2 = m2.getNth(n2);
    return new Numbers(this.document, m2.pointer);
  };
  View2.prototype.percentages = function(n2) {
    let m2 = find$6(this);
    m2 = m2.filter((v2) => v2.has("#Percent") || v2.after("^percent"));
    m2 = m2.getNth(n2);
    return new Numbers(this.document, m2.pointer);
  };
  View2.prototype.money = function(n2) {
    let m2 = find$6(this);
    m2 = m2.filter((v2) => v2.has("#Money") || v2.after("^#Currency"));
    m2 = m2.getNth(n2);
    return new Numbers(this.document, m2.pointer);
  };
  View2.prototype.values = View2.prototype.numbers;
};
var numbers$1 = addMethod$2;
const api$b = function(View2) {
  fractions(View2);
  numbers$1(View2);
};
var numbers = {
  api: api$b
};
const defaults = {
  people: true,
  emails: true,
  phoneNumbers: true,
  places: true
};
const redact = function(opts2 = {}) {
  opts2 = Object.assign({}, defaults, opts2);
  if (opts2.people !== false) {
    this.people().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
  }
  if (opts2.emails !== false) {
    this.emails().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
  }
  if (opts2.places !== false) {
    this.places().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
  }
  if (opts2.phoneNumbers !== false) {
    this.phoneNumbers().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
  }
  return this;
};
const plugin = {
  api: function(View2) {
    View2.prototype.redact = redact;
  }
};
var redact$1 = plugin;
const isQuestion = function(doc) {
  let clauses2 = doc.clauses();
  if (/\.\.$/.test(doc.out("text"))) {
    return false;
  }
  if (doc.has("^#QuestionWord") && doc.has("@hasComma")) {
    return false;
  }
  if (doc.has("or not$")) {
    return true;
  }
  if (doc.has("^#QuestionWord")) {
    return true;
  }
  if (doc.has("^(do|does|did|is|was|can|could|will|would|may) #Noun")) {
    return true;
  }
  if (doc.has("^(have|must) you")) {
    return true;
  }
  if (clauses2.has("(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$")) {
    return true;
  }
  return false;
};
const findQuestions = function(view) {
  const hasQ = /\?/;
  const { document: document2 } = view;
  return view.filter((m2) => {
    let terms = m2.docs[0] || [];
    let lastTerm = terms[terms.length - 1];
    if (!lastTerm || document2[lastTerm.index[0]].length !== terms.length) {
      return false;
    }
    if (hasQ.test(lastTerm.post)) {
      return true;
    }
    return isQuestion(m2);
  });
};
var isQuestion$1 = findQuestions;
const subordinate = `(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)`;
const relative = `(that|which|whichever|who|whoever|whom|whose|whomever)`;
const mainClause = function(s2) {
  let m2 = s2;
  if (m2.length === 1) {
    return m2;
  }
  m2 = m2.if("#Verb");
  if (m2.length === 1) {
    return m2;
  }
  m2 = m2.ifNo(subordinate);
  m2 = m2.ifNo("^even (if|though)");
  m2 = m2.ifNo("^so that");
  m2 = m2.ifNo("^rather than");
  m2 = m2.ifNo("^provided that");
  if (m2.length === 1) {
    return m2;
  }
  m2 = m2.ifNo(relative);
  if (m2.length === 1) {
    return m2;
  }
  m2 = m2.ifNo("(despite|during|before|through|throughout)");
  if (m2.length === 1) {
    return m2;
  }
  if (m2.length === 0) {
    m2 = s2;
  }
  return m2.eq(0);
};
var findMain = mainClause;
const grammar = function(vb2) {
  let tense = null;
  if (vb2.has("#PastTense")) {
    tense = "PastTense";
  } else if (vb2.has("#FutureTense")) {
    tense = "FutureTense";
  } else if (vb2.has("#PresentTense")) {
    tense = "PresentTense";
  }
  return {
    tense
  };
};
const parse$2 = function(s2) {
  let clauses2 = s2.clauses();
  let main = findMain(clauses2);
  let chunks2 = main.chunks();
  let subj = s2.none();
  let verb2 = s2.none();
  let pred = s2.none();
  chunks2.forEach((ch, i2) => {
    if (i2 === 0 && !ch.has("<Verb>")) {
      subj = ch;
      return;
    }
    if (!verb2.found && ch.has("<Verb>")) {
      verb2 = ch;
      return;
    }
    if (verb2.found) {
      pred = pred.concat(ch);
    }
  });
  if (verb2.found && !subj.found) {
    subj = verb2.before("<Noun>+").first();
  }
  return {
    subj,
    verb: verb2,
    pred,
    grammar: grammar(verb2)
  };
};
var parse$3 = parse$2;
const toPast$3 = function(s2) {
  let verbs2 = s2.verbs();
  let first = verbs2.eq(0);
  if (first.has("#PastTense")) {
    return s2;
  }
  first.toPastTense();
  if (verbs2.length > 1) {
    verbs2 = verbs2.slice(1);
    verbs2 = verbs2.filter((v2) => !v2.lookBehind("to$").found);
    verbs2 = verbs2.if("#PresentTense");
    verbs2 = verbs2.notIf("#Gerund");
    let list2 = s2.match("to #Verb+ #Conjunction #Verb").terms();
    verbs2 = verbs2.not(list2);
    if (verbs2.found) {
      verbs2.verbs().toPastTense();
    }
  }
  return s2;
};
var toPast$4 = toPast$3;
const toPresent$2 = function(s2) {
  let verbs2 = s2.verbs();
  let first = verbs2.eq(0);
  first.toPresentTense();
  if (verbs2.length > 1) {
    verbs2 = verbs2.slice(1);
    verbs2 = verbs2.filter((v2) => !v2.lookBehind("to$").found);
    verbs2 = verbs2.notIf("#Gerund");
    if (verbs2.found) {
      verbs2.verbs().toPresentTense();
    }
  }
  return s2;
};
var toPresent$3 = toPresent$2;
const toFuture$2 = function(s2) {
  let verbs2 = s2.verbs();
  let first = verbs2.eq(0);
  first.toFutureTense();
  s2 = s2.fullSentence();
  verbs2 = s2.verbs();
  if (verbs2.length > 1) {
    verbs2 = verbs2.slice(1);
    let toChange = verbs2.filter((vb2) => {
      if (vb2.lookBehind("to$").found) {
        return false;
      }
      if (vb2.has("#Copula #Gerund")) {
        return true;
      }
      if (vb2.has("#Gerund")) {
        return false;
      }
      if (vb2.has("#Copula")) {
        return true;
      }
      if (vb2.has("#PresentTense") && !vb2.has("#Infinitive") && vb2.lookBefore("(he|she|it|that|which)$").found) {
        return false;
      }
      return true;
    });
    if (toChange.found) {
      toChange.forEach((m2) => {
        if (m2.has("#Copula")) {
          m2.match("was").replaceWith("is");
          m2.match("is").replaceWith("will be");
          return;
        }
        m2.toInfinitive();
      });
    }
  }
  return s2;
};
var toFuture$3 = toFuture$2;
const toNegative$2 = function(s2) {
  s2.verbs().first().toNegative().compute("chunks");
  return s2;
};
const toPositive = function(s2) {
  s2.verbs().first().toPositive().compute("chunks");
  return s2;
};
const toInfinitive = function(s2) {
  s2.verbs().toInfinitive();
  return s2;
};
var toInfinitive$1 = toInfinitive;
const api$9 = function(View2) {
  class Sentences extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Sentences";
    }
    json(opts2 = {}) {
      return this.map((m2) => {
        let json2 = m2.toView().json(opts2)[0] || {};
        let { subj, verb: verb2, pred, grammar: grammar2 } = parse$3(m2);
        json2.sentence = {
          subject: subj.text("normal"),
          verb: verb2.text("normal"),
          predicate: pred.text("normal"),
          grammar: grammar2
        };
        return json2;
      }, []);
    }
    toPastTense(n2) {
      return this.getNth(n2).map((s2) => {
        parse$3(s2);
        return toPast$4(s2);
      });
    }
    toPresentTense(n2) {
      return this.getNth(n2).map((s2) => {
        parse$3(s2);
        return toPresent$3(s2);
      });
    }
    toFutureTense(n2) {
      return this.getNth(n2).map((s2) => {
        parse$3(s2);
        s2 = toFuture$3(s2);
        return s2;
      });
    }
    toInfinitive(n2) {
      return this.getNth(n2).map((s2) => {
        parse$3(s2);
        return toInfinitive$1(s2);
      });
    }
    toNegative(n2) {
      return this.getNth(n2).map((vb2) => {
        parse$3(vb2);
        return toNegative$2(vb2);
      });
    }
    toPositive(n2) {
      return this.getNth(n2).map((vb2) => {
        parse$3(vb2);
        return toPositive(vb2);
      });
    }
    isQuestion(n2) {
      return this.questions(n2);
    }
    isExclamation(n2) {
      let res = this.filter((s2) => s2.lastTerm().has("@hasExclamation"));
      return res.getNth(n2);
    }
    isStatement(n2) {
      let res = this.filter((s2) => !s2.isExclamation().found && !s2.isQuestion().found);
      return res.getNth(n2);
    }
    update(pointer) {
      let m2 = new Sentences(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  Sentences.prototype.toPresent = Sentences.prototype.toPresentTense;
  Sentences.prototype.toPast = Sentences.prototype.toPastTense;
  Sentences.prototype.toFuture = Sentences.prototype.toFutureTense;
  const methods2 = {
    sentences: function(n2) {
      let m2 = this.map((s2) => s2.fullSentence());
      m2 = m2.getNth(n2);
      return new Sentences(this.document, m2.pointer);
    },
    questions: function(n2) {
      let m2 = isQuestion$1(this);
      return m2.getNth(n2);
    }
  };
  Object.assign(View2.prototype, methods2);
};
var api$a = api$9;
var sentences = { api: api$a };
const find$4 = function(doc) {
  let m2 = doc.match("#Honorific+? #Person+");
  return m2;
};
var find$5 = find$4;
const parse = function(m2) {
  let res = {};
  res.firstName = m2.match("#FirstName+");
  res.lastName = m2.match("#LastName+");
  res.honorific = m2.match("#Honorific+");
  let last = res.lastName;
  let first = res.firstName;
  if (!first.found || !last.found) {
    if (!first.found && !last.found && m2.has("^#Honorific .$")) {
      res.lastName = m2.match(".$");
      return res;
    }
  }
  return res;
};
var parse$1 = parse;
const m$1 = "male";
const f = "female";
const honorifics = {
  mr: m$1,
  mrs: f,
  miss: f,
  madam: f,
  king: m$1,
  queen: f,
  duke: m$1,
  duchess: f,
  baron: m$1,
  baroness: f,
  count: m$1,
  countess: f,
  prince: m$1,
  princess: f,
  sire: m$1,
  dame: f,
  lady: f,
  ayatullah: m$1,
  congressman: m$1,
  congresswoman: f,
  "first lady": f,
  mx: null
};
const predictGender = function(parsed, person2) {
  let { firstName, honorific } = parsed;
  if (firstName.has("#FemaleName")) {
    return f;
  }
  if (firstName.has("#MaleName")) {
    return m$1;
  }
  if (honorific.found) {
    let hon = honorific.text("normal");
    hon = hon.replace(/\./g, "");
    if (honorifics.hasOwnProperty(hon)) {
      return honorifics[hon];
    }
    if (/^her /.test(hon)) {
      return f;
    }
    if (/^his /.test(hon)) {
      return m$1;
    }
  }
  let after2 = person2.after();
  if (!after2.has("#Person") && after2.has("#Pronoun")) {
    let pro = after2.match("#Pronoun");
    if (pro.has("(they|their)")) {
      return null;
    }
    let hasMasc = pro.has("(he|his)");
    let hasFem = pro.has("(she|her|hers)");
    if (hasMasc && !hasFem) {
      return m$1;
    }
    if (hasFem && !hasMasc) {
      return f;
    }
  }
  return null;
};
var gender = predictGender;
const addMethod$1 = function(View2) {
  class People extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "People";
    }
    parse(n2) {
      return this.getNth(n2).map(parse$1);
    }
    json(n2) {
      let opts2 = typeof n2 === "object" ? n2 : {};
      return this.getNth(n2).map((p2) => {
        let json2 = p2.toView().json(opts2)[0];
        let parsed = parse$1(p2);
        json2.person = {
          firstName: parsed.firstName.text("normal"),
          lastName: parsed.lastName.text("normal"),
          honorific: parsed.honorific.text("normal"),
          presumed_gender: gender(parsed, p2)
        };
        return json2;
      }, []);
    }
    presumedMale() {
      return this.filter((m2) => {
        return m2.has("(#MaleName|mr|mister|sr|jr|king|pope|prince|sir)");
      });
    }
    presumedFemale() {
      return this.filter((m2) => {
        return m2.has("(#FemaleName|mrs|miss|queen|princess|madam)");
      });
    }
    update(pointer) {
      let m2 = new People(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  View2.prototype.people = function(n2) {
    let m2 = find$5(this);
    m2 = m2.getNth(n2);
    return new People(this.document, m2.pointer);
  };
};
var people = addMethod$1;
const find$2 = function(doc) {
  let m2 = doc.match("(#Place|#Address)+");
  let splits = m2.match("@hasComma");
  splits = splits.filter((c2) => {
    if (c2.has("(asia|africa|europe|america)$")) {
      return true;
    }
    if (c2.has("(#City|#Region|#ProperNoun)$") && c2.after("^(#Country|#Region)").found) {
      return false;
    }
    return true;
  });
  m2 = m2.splitAfter(splits);
  return m2;
};
var find$3 = find$2;
const addMethod = function(View2) {
  View2.prototype.places = function(n2) {
    let m2 = find$3(this);
    m2 = m2.getNth(n2);
    return new View2(this.document, m2.pointer);
  };
};
var places = addMethod;
const api$8 = function(View2) {
  View2.prototype.organizations = function(n2) {
    let m2 = this.match("#Organization+");
    return m2.getNth(n2);
  };
};
var orgs = api$8;
const find$1 = function(n2) {
  let r2 = this.clauses();
  let m2 = r2.people();
  m2 = m2.concat(r2.places());
  m2 = m2.concat(r2.organizations());
  m2 = m2.not("(someone|man|woman|mother|brother|sister|father)");
  m2 = m2.sort("seq");
  m2 = m2.getNth(n2);
  return m2;
};
const api$7 = function(View2) {
  View2.prototype.topics = find$1;
};
var topics$1 = api$7;
const api$6 = function(View2) {
  people(View2);
  places(View2);
  orgs(View2);
  topics$1(View2);
};
var topics = { api: api$6 };
const findVerbs = function(doc) {
  let m2 = doc.match("<Verb>");
  m2 = m2.not("#Conjunction");
  m2 = m2.not("#Preposition");
  m2 = m2.splitAfter("@hasComma");
  m2 = m2.splitAfter("[(do|did|am|was|is|will)] (is|was)", 0);
  m2 = m2.splitBefore("(#Verb && !#Copula) [being] #Verb", 0);
  m2 = m2.splitBefore("#Verb [to be] #Verb", 0);
  m2 = m2.splitAfter("[help] #PresentTense", 0);
  m2 = m2.splitBefore("(#PresentTense|#PastTense) [#Copula]$", 0);
  m2 = m2.splitBefore("(#PresentTense|#PastTense) [will be]$", 0);
  m2 = m2.splitBefore("(#PresentTense|#PastTense) [(had|has)]", 0);
  m2 = m2.not("#Reflexive$");
  m2 = m2.not("#Adjective");
  m2 = m2.splitAfter("[#PastTense] #PastTense", 0);
  m2 = m2.splitAfter("[#PastTense] #Auxiliary+ #PastTense", 0);
  m2 = m2.splitAfter("#Copula [#Gerund] #PastTense", 0);
  m2 = m2.if("#Verb");
  if (m2.has("(#Verb && !#Auxiliary) #Adverb+? #Copula")) {
    m2 = m2.splitBefore("#Copula");
  }
  return m2;
};
var find = findVerbs;
const getMain = function(vb2) {
  let root2 = vb2;
  if (vb2.wordCount() > 1) {
    root2 = vb2.not("(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)");
  }
  if (root2.length > 1 && !root2.has("#Phrasal #Particle")) {
    root2 = root2.last();
  }
  root2 = root2.not("(want|wants|wanted) to");
  if (!root2.found) {
    root2 = vb2.not("#Negative");
    return root2;
  }
  return root2;
};
var getRoot = getMain;
const getAdverbs = function(vb2, root2) {
  let res = {
    pre: vb2.none(),
    post: vb2.none()
  };
  if (!vb2.has("#Adverb")) {
    return res;
  }
  let parts = vb2.splitOn(root2);
  if (parts.length === 3) {
    return {
      pre: parts.eq(0).adverbs(),
      post: parts.eq(2).adverbs()
    };
  }
  if (parts.eq(0).isDoc(root2)) {
    res.post = parts.eq(1).adverbs();
    return res;
  }
  res.pre = parts.eq(0).adverbs();
  return res;
};
var getAdverbs$1 = getAdverbs;
const getAuxiliary = function(vb2, root2) {
  let parts = vb2.splitBefore(root2);
  if (parts.length <= 1) {
    return vb2.none();
  }
  let aux = parts.eq(0);
  aux = aux.not("(#Adverb|#Negative|#Prefix)");
  return aux;
};
const getNegative = function(vb2) {
  return vb2.match("#Negative");
};
const getPhrasal = function(root2) {
  if (!root2.has("(#Particle|#PhrasalVerb)")) {
    return {
      verb: root2.none(),
      particle: root2.none()
    };
  }
  let particle = root2.match("#Particle$");
  return {
    verb: root2.not(particle),
    particle
  };
};
const parseVerb = function(view) {
  let vb2 = view.clone();
  vb2.contractions().expand();
  const root2 = getRoot(vb2);
  let res = {
    root: root2,
    prefix: vb2.match("#Prefix"),
    adverbs: getAdverbs$1(vb2, root2),
    auxiliary: getAuxiliary(vb2, root2),
    negative: getNegative(vb2),
    phrasal: getPhrasal(root2)
  };
  return res;
};
var parseVerb$1 = parseVerb;
const present = { tense: "PresentTense" };
const conditional = { conditional: true };
const future = { tense: "FutureTense" };
const prog = { progressive: true };
const past = { tense: "PastTense" };
const complete = { complete: true, progressive: false };
const passive = { passive: true };
const plural = { plural: true };
const singular = { plural: false };
const getData = function(tags2) {
  let data2 = {};
  tags2.forEach((o2) => {
    Object.assign(data2, o2);
  });
  return data2;
};
const verbForms = {
  "imperative": [
    ["#Imperative", []]
  ],
  "want-infinitive": [
    ["^(want|wants|wanted) to #Infinitive$", [present]],
    ["^wanted to #Infinitive$", [past]],
    ["^will want to #Infinitive$", [future]]
  ],
  "gerund-phrase": [
    ["^#PastTense #Gerund$", [past]],
    ["^#PresentTense #Gerund$", [present]],
    ["^#Infinitive #Gerund$", [present]],
    ["^will #Infinitive #Gerund$", [future]],
    ["^have #PastTense #Gerund$", [past]],
    ["^will have #PastTense #Gerund$", [past]]
  ],
  "simple-present": [
    ["^#PresentTense$", [present]],
    ["^#Infinitive$", [present]]
  ],
  "simple-past": [
    ["^#PastTense$", [past]]
  ],
  "simple-future": [
    ["^will #Adverb? #Infinitive", [future]]
  ],
  "present-progressive": [
    ["^(is|are|am) #Gerund$", [present, prog]]
  ],
  "past-progressive": [
    ["^(was|were) #Gerund$", [past, prog]]
  ],
  "future-progressive": [
    ["^will be #Gerund$", [future, prog]]
  ],
  "present-perfect": [
    ["^(has|have) #PastTense$", [past, complete]]
  ],
  "past-perfect": [
    ["^had #PastTense$", [past, complete]],
    ["^had #PastTense to #Infinitive", [past, complete]]
  ],
  "future-perfect": [
    ["^will have #PastTense$", [future, complete]]
  ],
  "present-perfect-progressive": [
    ["^(has|have) been #Gerund$", [past, prog]]
  ],
  "past-perfect-progressive": [
    ["^had been #Gerund$", [past, prog]]
  ],
  "future-perfect-progressive": [
    ["^will have been #Gerund$", [future, prog]]
  ],
  "passive-past": [
    ["(got|were|was) #Passive", [past, passive]],
    ["^(was|were) being #Passive", [past, passive]],
    ["^(had|have) been #Passive", [past, passive]]
  ],
  "passive-present": [
    ["^(is|are|am) #Passive", [present, passive]],
    ["^(is|are|am) being #Passive", [present, passive]],
    ["^has been #Passive", [present, passive]]
  ],
  "passive-future": [
    ["will have been #Passive", [future, passive, conditional]],
    ["will be being? #Passive", [future, passive, conditional]]
  ],
  "present-conditional": [
    ["would be #PastTense", [present, conditional]]
  ],
  "past-conditional": [
    ["would have been #PastTense", [past, conditional]]
  ],
  "auxiliary-future": [
    ["(is|are|am|was) going to (#Infinitive|#PresentTense)", [future]]
  ],
  "auxiliary-past": [
    ["^did #Infinitive$", [past, singular]],
    ["^used to #Infinitive$", [past, complete]]
  ],
  "auxiliary-present": [
    ["^(does|do) #Infinitive$", [present, complete, plural]]
  ],
  "modal-past": [
    ["^(could|must|should|shall) have #PastTense$", [past]]
  ],
  "modal-infinitive": [
    ["^#Modal #Infinitive$", []]
  ],
  "infinitive": [
    ["^#Infinitive$", []]
  ]
};
let list = [];
Object.keys(verbForms).map((k2) => {
  verbForms[k2].forEach((a2) => {
    list.push({
      name: k2,
      match: a2[0],
      data: getData(a2[1])
    });
  });
});
var forms$5 = list;
const cleanUp = function(vb2, res) {
  vb2 = vb2.clone();
  if (res.adverbs.post && res.adverbs.post.found) {
    vb2.remove(res.adverbs.post);
  }
  if (res.adverbs.pre && res.adverbs.pre.found) {
    vb2.remove(res.adverbs.pre);
  }
  if (vb2.has("#Negative")) {
    vb2 = vb2.remove("#Negative");
  }
  if (vb2.has("#Prefix")) {
    vb2 = vb2.remove("#Prefix");
  }
  if (res.root.has("#PhrasalVerb #Particle")) {
    vb2.remove("#Particle$");
  }
  vb2 = vb2.not("#Adverb");
  return vb2;
};
const isInfinitive = function(vb2) {
  if (vb2.has("#Infinitive")) {
    let m2 = vb2.growLeft("to");
    if (m2.has("^to #Infinitive")) {
      return true;
    }
  }
  return false;
};
const getGrammar = function(vb2, res) {
  let grammar2 = {};
  vb2 = cleanUp(vb2, res);
  for (let i2 = 0; i2 < forms$5.length; i2 += 1) {
    let todo = forms$5[i2];
    if (vb2.has(todo.match) === true) {
      grammar2.form = todo.name;
      Object.assign(grammar2, todo.data);
      break;
    }
  }
  if (!grammar2.form) {
    if (vb2.has("^#Verb$")) {
      grammar2.form = "infinitive";
    }
  }
  if (!grammar2.tense) {
    grammar2.tense = res.root.has("#PastTense") ? "PastTense" : "PresentTense";
  }
  grammar2.copula = res.root.has("#Copula");
  grammar2.isInfinitive = isInfinitive(vb2);
  return grammar2;
};
var getGrammar$1 = getGrammar;
const shouldSkip = function(last) {
  if (last.length <= 1) {
    return false;
  }
  let obj = last.parse()[0] || {};
  return obj.isSubordinate;
};
const noSubClause = function(before2) {
  let parts = before2.clauses();
  parts = parts.filter((m2, i2) => {
    if (m2.has("^(if|unless|while|but|for|per|at|by|that|which|who|from)")) {
      return false;
    }
    if (i2 > 0 && m2.has("^#Verb . #Noun+$")) {
      return false;
    }
    if (i2 > 0 && m2.has("^#Adverb")) {
      return false;
    }
    return true;
  });
  if (parts.length === 0) {
    return before2;
  }
  return parts;
};
const lastNoun = function(vb2) {
  let before2 = vb2.before();
  before2 = noSubClause(before2);
  let nouns2 = before2.nouns();
  let last = nouns2.last();
  let pronoun = last.match("(i|he|she|we|you|they)");
  if (pronoun.found) {
    return pronoun.nouns();
  }
  let det = nouns2.if("^(that|this|those)");
  if (det.found) {
    return det;
  }
  if (nouns2.found === false) {
    det = before2.match("^(that|this|those)");
    if (det.found) {
      return det;
    }
  }
  last = nouns2.last();
  if (shouldSkip(last)) {
    nouns2.remove(last);
    last = nouns2.last();
  }
  if (shouldSkip(last)) {
    nouns2.remove(last);
    last = nouns2.last();
  }
  return last;
};
const isPlural$1 = function(subj, vb2) {
  if (vb2.has("(are|were|does)")) {
    return true;
  }
  if (subj.has("(those|they|we)")) {
    return true;
  }
  if (subj.found && subj.isPlural) {
    return subj.isPlural().found;
  }
  return false;
};
const getSubject = function(vb2) {
  let subj = lastNoun(vb2);
  return {
    subject: subj,
    plural: isPlural$1(subj, vb2)
  };
};
var getSubject$1 = getSubject;
const noop = (vb2) => vb2;
const isPlural = (vb2, parsed) => {
  let subj = getSubject$1(vb2);
  let m2 = subj.subject;
  if (m2.has("i") || m2.has("we")) {
    return true;
  }
  return subj.plural;
};
const wasWere = (vb2, parsed) => {
  let { subject, plural: plural2 } = getSubject$1(vb2);
  if (plural2 || subject.has("we")) {
    return "were";
  }
  return "was";
};
const isAreAm = function(vb2, parsed) {
  if (vb2.has("were")) {
    return "are";
  }
  let { subject, plural: plural2 } = getSubject$1(vb2);
  if (subject.has("i")) {
    return "am";
  }
  if (subject.has("we") || plural2) {
    return "are";
  }
  return "is";
};
const doDoes = function(vb2, parsed) {
  let subj = getSubject$1(vb2);
  let m2 = subj.subject;
  if (m2.has("i") || m2.has("we")) {
    return "do";
  }
  if (subj.plural) {
    return "do";
  }
  return "does";
};
const getTense = function(m2) {
  if (m2.has("#Infinitive")) {
    return "Infinitive";
  }
  if (m2.has("#Participle")) {
    return "Participle";
  }
  if (m2.has("#PastTense")) {
    return "PastTense";
  }
  if (m2.has("#Gerund")) {
    return "Gerund";
  }
  if (m2.has("#PresentTense")) {
    return "PresentTense";
  }
  return void 0;
};
const toInf$3 = function(vb2, parsed) {
  const { toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  let str = parsed.root.text({ keepPunct: false });
  str = toInfinitive2(str, vb2.model, getTense(vb2));
  if (str) {
    vb2.replace(parsed.root, str);
  }
  return vb2;
};
const noWill = (vb2) => {
  if (vb2.has("will not")) {
    return vb2.replace("will not", "have not");
  }
  return vb2.remove("will");
};
const toArray = function(m2) {
  if (!m2 || !m2.isView) {
    return [];
  }
  const opts2 = { normal: true, terms: false, text: false };
  return m2.json(opts2).map((s2) => s2.normal);
};
const toText = function(m2) {
  if (!m2 || !m2.isView) {
    return "";
  }
  return m2.text("normal");
};
const toInf$2 = function(root2) {
  const { toInfinitive: toInfinitive2 } = root2.methods.two.transform.verb;
  let str = root2.text("normal");
  return toInfinitive2(str, root2.model, getTense(root2));
};
const toJSON = function(vb2) {
  let parsed = parseVerb$1(vb2);
  vb2 = vb2.clone().toView();
  const info = getGrammar$1(vb2, parsed);
  return {
    root: parsed.root.text(),
    preAdverbs: toArray(parsed.adverbs.pre),
    postAdverbs: toArray(parsed.adverbs.post),
    auxiliary: toText(parsed.auxiliary),
    negative: parsed.negative.found,
    prefix: toText(parsed.prefix),
    infinitive: toInf$2(parsed.root),
    grammar: info
  };
};
var toJSON$1 = toJSON;
const keep$5 = { tags: true };
const toInf = function(vb2, parsed) {
  const { toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const { root: root2, auxiliary: auxiliary2 } = parsed;
  let aux = auxiliary2.terms().harden();
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (str) {
    vb2.replace(root2, str, keep$5).tag("Verb").firstTerm().tag("Infinitive");
  }
  if (aux.found) {
    vb2.remove(aux);
  }
  if (parsed.negative.found) {
    if (!vb2.has("not")) {
      vb2.prepend("not");
    }
    let does = doDoes(vb2);
    vb2.prepend(does);
  }
  vb2.fullSentence().compute(["lexicon", "preTagger", "postTagger", "chunks"]);
  return vb2;
};
var toInf$1 = toInf;
const keep$4 = { tags: true };
const fns = {
  noAux: (vb2, parsed) => {
    if (parsed.auxiliary.found) {
      vb2 = vb2.remove(parsed.auxiliary);
    }
    return vb2;
  },
  simple: (vb2, parsed) => {
    const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
    const root2 = parsed.root;
    if (root2.has("#Modal")) {
      return vb2;
    }
    let str = root2.text({ keepPunct: false });
    str = toInfinitive2(str, vb2.model, getTense(root2));
    let all2 = conjugate2(str, vb2.model);
    str = all2.PastTense;
    str = str === "been" ? "was" : str;
    if (str === "was") {
      str = wasWere(vb2);
    }
    if (str) {
      vb2.replace(root2, str, keep$4);
    }
    return vb2;
  },
  both: function(vb2, parsed) {
    if (parsed.negative.found) {
      vb2.replace("will", "did");
      return vb2;
    }
    vb2 = fns.simple(vb2, parsed);
    vb2 = fns.noAux(vb2, parsed);
    return vb2;
  },
  hasHad: (vb2) => {
    vb2.replace("has", "had", keep$4);
    return vb2;
  },
  hasParticiple: (vb2, parsed) => {
    const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
    const root2 = parsed.root;
    let str = root2.text("normal");
    str = toInfinitive2(str, vb2.model, getTense(root2));
    return conjugate2(str, vb2.model).Participle;
  }
};
const forms$4 = {
  "infinitive": fns.simple,
  "simple-present": fns.simple,
  "simple-past": noop,
  "simple-future": fns.both,
  "present-progressive": (vb2) => {
    vb2.replace("are", "were", keep$4);
    vb2.replace("(is|are|am)", "was", keep$4);
    return vb2;
  },
  "past-progressive": noop,
  "future-progressive": (vb2, parsed) => {
    vb2.match(parsed.root).insertBefore("was");
    vb2.remove("(will|be)");
    return vb2;
  },
  "present-perfect": fns.hasHad,
  "past-perfect": noop,
  "future-perfect": (vb2, parsed) => {
    vb2.match(parsed.root).insertBefore("had");
    if (vb2.has("will")) {
      vb2 = noWill(vb2);
    }
    vb2.remove("have");
    return vb2;
  },
  "present-perfect-progressive": fns.hasHad,
  "past-perfect-progressive": noop,
  "future-perfect-progressive": (vb2) => {
    vb2.remove("will");
    vb2.replace("have", "had", keep$4);
    return vb2;
  },
  "passive-past": (vb2) => {
    vb2.replace("have", "had", keep$4);
    return vb2;
  },
  "passive-present": (vb2) => {
    vb2.replace("(is|are)", "was", keep$4);
    return vb2;
  },
  "passive-future": (vb2, parsed) => {
    if (parsed.auxiliary.has("will be")) {
      vb2.match(parsed.root).insertBefore("had been");
      vb2.remove("(will|be)");
    }
    if (parsed.auxiliary.has("will have been")) {
      vb2.replace("have", "had", keep$4);
      vb2.remove("will");
    }
    return vb2;
  },
  "present-conditional": (vb2) => {
    vb2.replace("be", "have been");
    return vb2;
  },
  "past-conditional": noop,
  "auxiliary-future": (vb2) => {
    vb2.replace("(is|are|am)", "was", keep$4);
    return vb2;
  },
  "auxiliary-past": noop,
  "auxiliary-present": (vb2) => {
    vb2.replace("(do|does)", "did", keep$4);
    return vb2;
  },
  "modal-infinitive": (vb2, parsed) => {
    if (vb2.has("can")) {
      vb2.replace("can", "could", keep$4);
    } else {
      fns.simple(vb2, parsed);
      vb2.match("#Modal").insertAfter("have").tag("Auxiliary");
    }
    return vb2;
  },
  "modal-past": noop,
  "want-infinitive": (vb2) => {
    vb2.replace("(want|wants)", "wanted", keep$4);
    vb2.remove("will");
    return vb2;
  },
  "gerund-phrase": (vb2, parsed) => {
    parsed.root = parsed.root.not("#Gerund$");
    fns.simple(vb2, parsed);
    noWill(vb2);
    return vb2;
  }
};
const toPast$1 = function(vb2, parsed, form) {
  if (forms$4.hasOwnProperty(form)) {
    vb2 = forms$4[form](vb2, parsed);
    vb2.fullSentence().compute(["tagger", "chunks"]);
    return vb2;
  }
  return vb2;
};
var toPast$2 = toPast$1;
const haveHas = function(vb2, parsed) {
  let subj = getSubject$1(vb2);
  let m2 = subj.subject;
  if (m2.has("(i|we|you)")) {
    return "have";
  }
  if (subj.plural === false) {
    return "has";
  }
  if (m2.has("he") || m2.has("she") || m2.has("#Person")) {
    return "has";
  }
  return "have";
};
const simple$2 = (vb2, parsed) => {
  const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const { root: root2, auxiliary: auxiliary2 } = parsed;
  if (root2.has("#Modal")) {
    return vb2;
  }
  let str = root2.text({ keepPunct: false });
  str = toInfinitive2(str, vb2.model, getTense(root2));
  let all2 = conjugate2(str, vb2.model);
  str = all2.Participle || all2.PastTense;
  if (str) {
    vb2 = vb2.replace(root2, str);
    let have = haveHas(vb2);
    vb2.prepend(have).match(have).tag("Auxiliary");
    vb2.remove(auxiliary2);
  }
  return vb2;
};
const forms$3 = {
  "infinitive": simple$2,
  "simple-present": simple$2,
  "simple-future": (vb2, parsed) => vb2.replace("will", haveHas(vb2)),
  "present-perfect": noop,
  "past-perfect": noop,
  "future-perfect": (vb2, parsed) => vb2.replace("will have", haveHas(vb2)),
  "present-perfect-progressive": noop,
  "past-perfect-progressive": noop,
  "future-perfect-progressive": noop
};
const toPast = function(vb2, parsed, form) {
  if (forms$3.hasOwnProperty(form)) {
    vb2 = forms$3[form](vb2, parsed);
    vb2.fullSentence().compute(["tagger", "chunks"]);
    return vb2;
  }
  vb2 = simple$2(vb2, parsed);
  vb2.fullSentence().compute(["tagger", "chunks"]);
  return vb2;
};
var toParticiple = toPast;
const keep$3 = { tags: true };
const simple$1 = (vb2, parsed) => {
  const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const root2 = parsed.root;
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (isPlural(vb2) === false) {
    str = conjugate2(str, vb2.model).PresentTense;
  }
  if (root2.has("#Copula")) {
    str = isAreAm(vb2);
  }
  if (str) {
    vb2 = vb2.replace(root2, str, keep$3);
    vb2.not("#Particle").tag("PresentTense");
  }
  return vb2;
};
const toGerund$2 = (vb2, parsed) => {
  const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const root2 = parsed.root;
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (isPlural(vb2) === false) {
    str = conjugate2(str, vb2.model).Gerund;
  }
  if (str) {
    vb2 = vb2.replace(root2, str, keep$3);
    vb2.not("#Particle").tag("Gerund");
  }
  return vb2;
};
const vbToInf = (vb2, parsed) => {
  const { toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const root2 = parsed.root;
  let str = parsed.root.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (str) {
    vb2 = vb2.replace(parsed.root, str, keep$3);
  }
  return vb2;
};
const forms$2 = {
  "infinitive": simple$1,
  "simple-present": (vb2, parsed) => {
    const { conjugate: conjugate2 } = vb2.methods.two.transform.verb;
    let { root: root2 } = parsed;
    if (root2.has("#Infinitive")) {
      let subj = getSubject$1(vb2);
      let m2 = subj.subject;
      if (isPlural(vb2) || m2.has("i")) {
        return vb2;
      }
      let str = root2.text("normal");
      let pres = conjugate2(str, vb2.model).PresentTense;
      if (str !== pres) {
        vb2.replace(root2, pres, keep$3);
      }
    } else {
      return simple$1(vb2, parsed);
    }
    return vb2;
  },
  "simple-past": simple$1,
  "simple-future": (vb2, parsed) => {
    const { root: root2, auxiliary: auxiliary2 } = parsed;
    if (auxiliary2.has("will") && root2.has("be")) {
      let str = isAreAm(vb2);
      vb2.replace(root2, str);
      vb2 = vb2.remove("will");
      vb2.replace("not " + str, str + " not");
    } else {
      simple$1(vb2, parsed);
      vb2 = vb2.remove("will");
    }
    return vb2;
  },
  "present-progressive": noop,
  "past-progressive": (vb2, parsed) => {
    let str = isAreAm(vb2);
    return vb2.replace("(were|was)", str, keep$3);
  },
  "future-progressive": (vb2) => {
    vb2.match("will").insertBefore("is");
    vb2.remove("be");
    return vb2.remove("will");
  },
  "present-perfect": (vb2, parsed) => {
    simple$1(vb2, parsed);
    vb2 = vb2.remove("(have|had|has)");
    return vb2;
  },
  "past-perfect": (vb2, parsed) => {
    let subj = getSubject$1(vb2);
    let m2 = subj.subject;
    if (isPlural(vb2) || m2.has("i")) {
      vb2 = toInf$3(vb2, parsed);
      vb2.remove("had");
      return vb2;
    }
    vb2.replace("had", "has", keep$3);
    return vb2;
  },
  "future-perfect": (vb2) => {
    vb2.match("will").insertBefore("has");
    return vb2.remove("have").remove("will");
  },
  "present-perfect-progressive": noop,
  "past-perfect-progressive": (vb2) => vb2.replace("had", "has", keep$3),
  "future-perfect-progressive": (vb2) => {
    vb2.match("will").insertBefore("has");
    return vb2.remove("have").remove("will");
  },
  "passive-past": (vb2, parsed) => {
    let str = isAreAm(vb2);
    if (vb2.has("(had|have|has)") && vb2.has("been")) {
      vb2.replace("(had|have|has)", str, keep$3);
      vb2.replace("been", "being");
      return vb2;
    }
    return vb2.replace("(got|was|were)", str);
  },
  "passive-present": noop,
  "passive-future": (vb2) => {
    vb2.replace("will", "is");
    return vb2.replace("be", "being");
  },
  "present-conditional": noop,
  "past-conditional": (vb2) => {
    vb2.replace("been", "be");
    return vb2.remove("have");
  },
  "auxiliary-future": (vb2, parsed) => {
    toGerund$2(vb2, parsed);
    vb2.remove("(going|to)");
    return vb2;
  },
  "auxiliary-past": (vb2, parsed) => {
    if (parsed.auxiliary.has("did")) {
      let str = doDoes(vb2);
      vb2.replace(parsed.auxiliary, str);
      return vb2;
    }
    toGerund$2(vb2, parsed);
    vb2.replace(parsed.auxiliary, "is");
    return vb2;
  },
  "auxiliary-present": noop,
  "modal-infinitive": noop,
  "modal-past": (vb2, parsed) => {
    vbToInf(vb2, parsed);
    return vb2.remove("have");
  },
  "gerund-phrase": (vb2, parsed) => {
    parsed.root = parsed.root.not("#Gerund$");
    simple$1(vb2, parsed);
    return vb2.remove("(will|have)");
  },
  "want-infinitive": (vb2, parsed) => {
    let str = "wants";
    if (isPlural(vb2)) {
      str = "want";
    }
    vb2.replace("(want|wanted|wants)", str, keep$3);
    vb2.remove("will");
    return vb2;
  }
};
const toPresent = function(vb2, parsed, form) {
  if (forms$2.hasOwnProperty(form)) {
    vb2 = forms$2[form](vb2, parsed);
    vb2.fullSentence().compute(["tagger", "chunks"]);
    return vb2;
  }
  return vb2;
};
var toPresent$1 = toPresent;
const keep$2 = { tags: true };
const simple = (vb2, parsed) => {
  const { toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const { root: root2, auxiliary: auxiliary2 } = parsed;
  if (root2.has("#Modal")) {
    return vb2;
  }
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (str) {
    vb2 = vb2.replace(root2, str, keep$2);
    vb2.not("#Particle").tag("Verb");
  }
  vb2.prepend("will").match("will").tag("Auxiliary");
  vb2.remove(auxiliary2);
  return vb2;
};
const progressive = (vb2, parsed) => {
  const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = vb2.methods.two.transform.verb;
  const { root: root2, auxiliary: auxiliary2 } = parsed;
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  if (str) {
    str = conjugate2(str, vb2.model).Gerund;
    vb2.replace(root2, str, keep$2);
    vb2.not("#Particle").tag("PresentTense");
  }
  vb2.remove(auxiliary2);
  vb2.prepend("will be").match("will be").tag("Auxiliary");
  return vb2;
};
const forms$1 = {
  "infinitive": simple,
  "simple-present": simple,
  "simple-past": simple,
  "simple-future": noop,
  "present-progressive": progressive,
  "past-progressive": progressive,
  "future-progressive": noop,
  "present-perfect": (vb2) => {
    vb2.match("(have|has)").replaceWith("will have");
    return vb2;
  },
  "past-perfect": (vb2) => vb2.replace("(had|has)", "will have"),
  "future-perfect": noop,
  "present-perfect-progressive": (vb2) => vb2.replace("has", "will have"),
  "past-perfect-progressive": (vb2) => vb2.replace("had", "will have"),
  "future-perfect-progressive": noop,
  "passive-past": (vb2) => {
    if (vb2.has("got")) {
      return vb2.replace("got", "will get");
    }
    if (vb2.has("(was|were)")) {
      vb2.replace("(was|were)", "will be");
      return vb2.remove("being");
    }
    if (vb2.has("(have|has|had) been")) {
      return vb2.replace("(have|has|had) been", "will be");
    }
    return vb2;
  },
  "passive-present": (vb2) => {
    vb2.replace("being", "will be");
    vb2.remove("(is|are|am)");
    return vb2;
  },
  "passive-future": noop,
  "present-conditional": (vb2) => vb2.replace("would", "will"),
  "past-conditional": (vb2) => vb2.replace("would", "will"),
  "auxiliary-future": noop,
  "auxiliary-past": (vb2) => {
    if (vb2.has("used") && vb2.has("to")) {
      vb2.replace("used", "will");
      return vb2.remove("to");
    }
    vb2.replace("did", "will");
    return vb2;
  },
  "auxiliary-present": (vb2) => {
    return vb2.replace("(do|does)", "will");
  },
  "modal-infinitive": noop,
  "modal-past": noop,
  "gerund-phrase": (vb2, parsed) => {
    parsed.root = parsed.root.not("#Gerund$");
    simple(vb2, parsed);
    return vb2.remove("(had|have)");
  },
  "want-infinitive": (vb2) => {
    vb2.replace("(want|wants|wanted)", "will want");
    return vb2;
  }
};
const toFuture = function(vb2, parsed, form) {
  if (vb2.has("will") || vb2.has("going to")) {
    return vb2;
  }
  if (forms$1.hasOwnProperty(form)) {
    vb2 = forms$1[form](vb2, parsed);
    vb2.fullSentence().compute(["tagger", "chunks"]);
    return vb2;
  }
  return vb2;
};
var toFuture$1 = toFuture;
const keep$1 = { tags: true };
const toGerund = function(vb2, parsed) {
  const { toInfinitive: toInfinitive2, conjugate: conjugate2 } = vb2.methods.two.transform.verb;
  const { root: root2, auxiliary: auxiliary2 } = parsed;
  if (vb2.has("#Gerund")) {
    return vb2;
  }
  let str = root2.text("normal");
  str = toInfinitive2(str, vb2.model, getTense(root2));
  let gerund2 = conjugate2(str, vb2.model).Gerund;
  if (gerund2) {
    let aux = isAreAm(vb2);
    vb2.replace(root2, gerund2, keep$1);
    vb2.remove(auxiliary2);
    vb2.prepend(aux);
  }
  vb2.replace("not is", "is not");
  vb2.replace("not are", "are not");
  vb2.fullSentence().compute(["tagger", "chunks"]);
  return vb2;
};
var toGerund$1 = toGerund;
const keep = { tags: true };
const doesNot = function(vb2, parsed) {
  let does = doDoes(vb2);
  vb2.prepend(does + " not");
  return vb2;
};
const isWas = function(vb2) {
  let m2 = vb2.match("be");
  if (m2.found) {
    m2.prepend("not");
    return vb2;
  }
  m2 = vb2.match("(is|was|am|are|will|were)");
  if (m2.found) {
    m2.append("not");
    return vb2;
  }
  return vb2;
};
const hasCopula = (vb2) => vb2.has("(is|was|am|are|will|were|be)");
const forms = {
  "simple-present": (vb2, parsed) => {
    if (hasCopula(vb2) === true) {
      return isWas(vb2);
    }
    vb2 = toInf$3(vb2, parsed);
    vb2 = doesNot(vb2);
    return vb2;
  },
  "simple-past": (vb2, parsed) => {
    if (hasCopula(vb2) === true) {
      return isWas(vb2);
    }
    vb2 = toInf$3(vb2, parsed);
    vb2.prepend("did not");
    return vb2;
  },
  "imperative": (vb2) => {
    vb2.prepend("do not");
    return vb2;
  },
  "infinitive": (vb2, parsed) => {
    if (hasCopula(vb2) === true) {
      return isWas(vb2);
    }
    return doesNot(vb2);
  },
  "passive-past": (vb2) => {
    if (vb2.has("got")) {
      vb2.replace("got", "get", keep);
      vb2.prepend("did not");
      return vb2;
    }
    let m2 = vb2.match("(was|were|had|have)");
    if (m2.found) {
      m2.append("not");
    }
    return vb2;
  },
  "auxiliary-past": (vb2) => {
    if (vb2.has("used")) {
      vb2.prepend("did not");
      return vb2;
    }
    let m2 = vb2.match("(did|does|do)");
    if (m2.found) {
      m2.append("not");
    }
    return vb2;
  },
  "want-infinitive": (vb2, parsed) => {
    vb2 = doesNot(vb2);
    vb2 = vb2.replace("wants", "want", keep);
    return vb2;
  }
};
const toNegative = function(vb2, parsed, form) {
  if (vb2.has("#Negative")) {
    return vb2;
  }
  if (forms.hasOwnProperty(form)) {
    vb2 = forms[form](vb2, parsed);
    return vb2;
  }
  let m2 = vb2.matchOne("be");
  if (m2.found) {
    m2.prepend("not");
    return vb2;
  }
  if (hasCopula(vb2) === true) {
    return isWas(vb2);
  }
  m2 = vb2.matchOne("(will|had|have|has|did|does|do|#Modal)");
  if (m2.found) {
    m2.append("not");
    return vb2;
  }
  return vb2;
};
var toNegative$1 = toNegative;
const api$4 = function(View2) {
  class Verbs extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Verbs";
    }
    parse(n2) {
      return this.getNth(n2).map(parseVerb$1);
    }
    json(opts2, n2) {
      let m2 = this.getNth(n2);
      let arr = m2.map((vb2) => {
        let json2 = vb2.toView().json(opts2)[0] || {};
        json2.verb = toJSON$1(vb2);
        return json2;
      }, []);
      return arr;
    }
    subjects(n2) {
      return this.getNth(n2).map((vb2) => {
        parseVerb$1(vb2);
        return getSubject$1(vb2).subject;
      });
    }
    adverbs(n2) {
      return this.getNth(n2).map((vb2) => vb2.match("#Adverb"));
    }
    isSingular(n2) {
      return this.getNth(n2).filter((vb2) => {
        return getSubject$1(vb2).plural !== true;
      });
    }
    isPlural(n2) {
      return this.getNth(n2).filter((vb2) => {
        return getSubject$1(vb2).plural === true;
      });
    }
    isImperative(n2) {
      return this.getNth(n2).filter((vb2) => vb2.has("#Imperative"));
    }
    toInfinitive(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        return toInf$1(vb2, parsed, info.form);
      });
    }
    toPresentTense(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.isInfinitive) {
          return vb2;
        }
        return toPresent$1(vb2, parsed, info.form);
      });
    }
    toPastTense(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.isInfinitive) {
          return vb2;
        }
        return toPast$2(vb2, parsed, info.form);
      });
    }
    toFutureTense(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.isInfinitive) {
          return vb2;
        }
        return toFuture$1(vb2, parsed, info.form);
      });
    }
    toGerund(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.isInfinitive) {
          return vb2;
        }
        return toGerund$1(vb2, parsed, info.form);
      });
    }
    toPastParticiple(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.isInfinitive) {
          return vb2;
        }
        return toParticiple(vb2, parsed, info.form);
      });
    }
    conjugate(n2) {
      const { conjugate: conjugate2, toInfinitive: toInfinitive2 } = this.world.methods.two.transform.verb;
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        if (info.form === "imperative") {
          info.form = "simple-present";
        }
        let inf = parsed.root.text("normal");
        if (!parsed.root.has("#Infinitive")) {
          let tense = getTense(parsed.root);
          inf = toInfinitive2(inf, vb2.model, tense) || inf;
        }
        return conjugate2(inf, vb2.model);
      }, []);
    }
    isNegative() {
      return this.if("#Negative");
    }
    isPositive() {
      return this.ifNo("#Negative");
    }
    toPositive() {
      let m2 = this.match("do not #Verb");
      if (m2.found) {
        m2.remove("do not");
      }
      return this.remove("#Negative");
    }
    toNegative(n2) {
      return this.getNth(n2).map((vb2) => {
        let parsed = parseVerb$1(vb2);
        let info = getGrammar$1(vb2, parsed);
        return toNegative$1(vb2, parsed, info.form);
      });
    }
    update(pointer) {
      let m2 = new Verbs(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  Verbs.prototype.toPast = Verbs.prototype.toPastTense;
  Verbs.prototype.toPresent = Verbs.prototype.toPresentTense;
  Verbs.prototype.toFuture = Verbs.prototype.toFutureTense;
  View2.prototype.verbs = function(n2) {
    let vb2 = find(this);
    vb2 = vb2.getNth(n2);
    return new Verbs(this.document, vb2.pointer);
  };
};
var api$5 = api$4;
var verbs = {
  api: api$5
};
const findChained = function(want, s2) {
  let m2 = s2.match(want);
  if (m2.found) {
    let ref2 = m2.pronouns().refersTo();
    if (ref2.found) {
      return ref2;
    }
  }
  return s2.none();
};
const prevSentence = function(m2) {
  if (!m2.found) {
    return m2;
  }
  let [n2] = m2.fullPointer[0];
  if (n2 && n2 > 0) {
    return m2.update([[n2 - 1]]);
  }
  return m2.none();
};
const byGender = function(ppl, gender2) {
  if (gender2 === "m") {
    return ppl.filter((m2) => !m2.presumedFemale().found);
  } else if (gender2 === "f") {
    return ppl.filter((m2) => !m2.presumedMale().found);
  }
  return ppl;
};
const getPerson = function(s2, gender2) {
  let people2 = s2.people();
  people2 = byGender(people2, gender2);
  if (people2.found) {
    return people2.last();
  }
  people2 = s2.nouns("#Actor");
  if (people2.found) {
    return people2.last();
  }
  if (gender2 === "f") {
    return findChained("(she|her|hers)", s2);
  }
  if (gender2 === "m") {
    return findChained("(he|him|his)", s2);
  }
  return s2.none();
};
var getPerson$1 = getPerson;
const getThey = function(s2) {
  let nouns2 = s2.nouns();
  let things = nouns2.isPlural().notIf("#Pronoun");
  if (things.found) {
    return things.last();
  }
  let chain = findChained("(they|their|theirs)", s2);
  if (chain.found) {
    return chain;
  }
  things = nouns2.match("(somebody|nobody|everybody|anybody|someone|noone|everyone|anyone)");
  if (things.found) {
    return things.last();
  }
  return s2.none();
};
var getThey$1 = getThey;
const addReference = function(pron, m2) {
  if (m2 && m2.found) {
    let term = pron.docs[0][0];
    term.reference = m2.ptrs[0];
  }
};
const stepBack = function(m2, cb) {
  let s2 = m2.before();
  let res = cb(s2);
  if (res.found) {
    return res;
  }
  s2 = prevSentence(m2);
  res = cb(s2);
  if (res.found) {
    return res;
  }
  s2 = prevSentence(s2);
  res = cb(s2);
  if (res.found) {
    return res;
  }
  return m2.none();
};
const coreference$1 = function(view) {
  let pronouns = view.pronouns().if("(he|him|his|she|her|hers|they|their|theirs|it|its)");
  pronouns.forEach((pron) => {
    let res = null;
    if (pron.has("(he|him|his)")) {
      res = stepBack(pron, (m2) => getPerson$1(m2, "m"));
    } else if (pron.has("(she|her|hers)")) {
      res = stepBack(pron, (m2) => getPerson$1(m2, "f"));
    } else if (pron.has("(they|their|theirs)")) {
      res = stepBack(pron, getThey$1);
    }
    if (res && res.found) {
      addReference(pron, res);
    }
  });
};
var coreference$2 = coreference$1;
const api$2 = function(View2) {
  class Pronouns extends View2 {
    constructor(document2, pointer, groups) {
      super(document2, pointer, groups);
      this.viewType = "Pronouns";
    }
    hasReference() {
      this.compute("coreference");
      return this.filter((m2) => {
        let term = m2.docs[0][0];
        return term.reference;
      });
    }
    refersTo() {
      this.compute("coreference");
      return this.map((m2) => {
        if (!m2.found) {
          return m2.none();
        }
        let term = m2.docs[0][0];
        if (term.reference) {
          return m2.update([term.reference]);
        }
        return m2.none();
      });
    }
    update(pointer) {
      let m2 = new Pronouns(this.document, pointer);
      m2._cache = this._cache;
      return m2;
    }
  }
  View2.prototype.pronouns = function(n2) {
    let m2 = this.match("#Pronoun");
    m2 = m2.getNth(n2);
    return new Pronouns(m2.document, m2.pointer);
  };
};
var api$3 = api$2;
var coreference = {
  compute: { coreference: coreference$2 },
  api: api$3
};
nlp$1.plugin(adjectives);
nlp$1.plugin(adverbs);
nlp$1.plugin(chunker);
nlp$1.plugin(coreference);
nlp$1.plugin(misc);
nlp$1.plugin(normalize);
nlp$1.plugin(nouns);
nlp$1.plugin(numbers);
nlp$1.plugin(redact$1);
nlp$1.plugin(sentences);
nlp$1.plugin(topics);
nlp$1.plugin(verbs);
const transformations = {
  dedup: (s2) => {
    return s2.replace(/([^c])\1/g, "$1");
  },
  dropInitialLetters: (s2) => {
    if (s2.match(/^(kn|gn|pn|ae|wr)/)) {
      return s2.substring(1, s2.length - 1);
    }
    return s2;
  },
  dropBafterMAtEnd: (s2) => {
    return s2.replace(/mb$/, "m");
  },
  cchange: (s2) => {
    s2 = s2.replace(/([^s]|^)(c)(h)/g, "$1x$3").trim();
    s2 = s2.replace(/cia/g, "xia");
    s2 = s2.replace(/c([iey])/g, "s$1");
    return s2.replace(/c/g, "k");
  },
  dchange: (s2) => {
    s2 = s2.replace(/d(ge|gy|gi)/g, "j$1");
    return s2.replace(/d/g, "t");
  },
  dropG: (s2) => {
    s2 = s2.replace(/gh(^$|[^aeiou])/g, "h$1");
    return s2.replace(/g(n|ned)$/g, "$1");
  },
  changeG: (s2) => {
    s2 = s2.replace(/gh/g, "f");
    s2 = s2.replace(/([^g]|^)(g)([iey])/g, "$1j$3");
    s2 = s2.replace(/gg/g, "g");
    return s2.replace(/g/g, "k");
  },
  dropH: (s2) => {
    return s2.replace(/([aeiou])h([^aeiou]|$)/g, "$1$2");
  },
  changeCK: (s2) => {
    return s2.replace(/ck/g, "k");
  },
  changePH: (s2) => {
    return s2.replace(/ph/g, "f");
  },
  changeQ: (s2) => {
    return s2.replace(/q/g, "k");
  },
  changeS: (s2) => {
    return s2.replace(/s(h|io|ia)/g, "x$1");
  },
  changeT: (s2) => {
    s2 = s2.replace(/t(ia[^n]|io)/g, "x$1");
    return s2;
  },
  dropT: (s2) => {
    return s2.replace(/tch/g, "ch");
  },
  changeV: (s2) => {
    return s2.replace(/v/g, "f");
  },
  changeWH: (s2) => {
    return s2.replace(/^wh/, "w");
  },
  dropW: (s2) => {
    return s2.replace(/w([^aeiou]|$)/g, "$1");
  },
  changeX: (s2) => {
    s2 = s2.replace(/^x/, "s");
    return s2.replace(/x/g, "ks");
  },
  dropY: (s2) => {
    return s2.replace(/y([^aeiou]|$)/g, "$1");
  },
  changeZ: (s2) => {
    return s2.replace(/z/, "s");
  },
  dropVowels: (s2) => {
    return s2;
  }
};
var m = transformations;
const metaphone = function(s2) {
  s2 = m.dedup(s2);
  s2 = m.dropInitialLetters(s2);
  s2 = m.dropBafterMAtEnd(s2);
  s2 = m.changeCK(s2);
  s2 = m.cchange(s2);
  s2 = m.dchange(s2);
  s2 = m.dropG(s2);
  s2 = m.changeG(s2);
  s2 = m.dropH(s2);
  s2 = m.changePH(s2);
  s2 = m.changeQ(s2);
  s2 = m.changeS(s2);
  s2 = m.changeX(s2);
  s2 = m.changeT(s2);
  s2 = m.dropT(s2);
  s2 = m.changeV(s2);
  s2 = m.changeWH(s2);
  s2 = m.dropW(s2);
  s2 = m.dropY(s2);
  s2 = m.changeZ(s2);
  s2 = m.dropVowels(s2);
  return s2.trim();
};
var metaphone$1 = metaphone;
const soundsLike = function(view) {
  view.docs.forEach((terms) => {
    terms.forEach((term) => {
      term.soundsLike = metaphone$1(term.normal || term.text);
    });
  });
};
var soundsLike$1 = soundsLike;
const starts_with_single_vowel_combos = /^(eu)/i;
const joining_consonant_vowel = /^[^aeiou]e([^d]|$)/;
const cvcv_same_consonant = /^([^aeiouy])[aeiouy]\1[aeiouy]/;
const cvcv_same_vowel = /^[^aeiouy]([aeiouy])[^aeiouy]\1/;
const cvcv_known_consonants = /^([tg][aeiouy]){2}/;
const only_one_or_more_c = /^[^aeiouy]+$/;
const ends_with_vowel$1 = /[aeiouy]$/;
const starts_with_consonant_vowel$1 = /^[^aeiouy]h?[aeiouy]/;
const ones = [
  /^[^aeiou]?ion/,
  /^[^aeiou]?ised/,
  /^[^aeiou]?iled/,
  /[aeiou]n[gt]$/,
  /\wa[gt]e$/
];
const postprocess = function(arr) {
  arr = arr.map(function(w) {
    return w.trim();
  });
  arr = arr.filter(function(w) {
    return w !== "";
  });
  let l2 = arr.length;
  if (l2 > 1) {
    let suffix = arr[l2 - 2] + arr[l2 - 1];
    for (let i2 = 0; i2 < ones.length; i2++) {
      if (suffix.match(ones[i2])) {
        arr[l2 - 2] = arr[l2 - 2] + arr[l2 - 1];
        arr.pop();
      }
    }
  }
  if (arr.length > 1) {
    let first_is_open = (arr[0].length === 1 || arr[0].match(starts_with_consonant_vowel$1)) && arr[0].match(ends_with_vowel$1);
    let second_is_joining = arr[1].match(joining_consonant_vowel);
    if (first_is_open && second_is_joining) {
      let possible_combination = arr[0] + arr[1];
      let probably_separate_syllables = possible_combination.match(cvcv_same_consonant) || possible_combination.match(cvcv_same_vowel) || possible_combination.match(cvcv_known_consonants);
      if (!probably_separate_syllables) {
        arr[0] = arr[0] + arr[1];
        arr.splice(1, 1);
      }
    }
  }
  if (arr.length > 1) {
    let second_to_last_is_open = arr[arr.length - 2].match(starts_with_consonant_vowel$1) && arr[arr.length - 2].match(ends_with_vowel$1);
    let last_is_joining = arr[arr.length - 1].match(joining_consonant_vowel) && ones.every((re) => !arr[arr.length - 1].match(re));
    if (second_to_last_is_open && last_is_joining) {
      let possible_combination = arr[arr.length - 2] + arr[arr.length - 1];
      let probably_separate_syllables = possible_combination.match(cvcv_same_consonant) || possible_combination.match(cvcv_same_vowel) || possible_combination.match(cvcv_known_consonants);
      if (!probably_separate_syllables) {
        arr[arr.length - 2] = arr[arr.length - 2] + arr[arr.length - 1];
        arr.splice(arr.length - 1, 1);
      }
    }
  }
  if (arr.length > 1) {
    let single = arr[0] + arr[1];
    if (single.match(starts_with_single_vowel_combos)) {
      arr[0] = single;
      arr.splice(1, 1);
    }
  }
  if (arr.length > 1) {
    if (arr[arr.length - 1].match(only_one_or_more_c)) {
      arr[arr.length - 2] = arr[arr.length - 2] + arr[arr.length - 1];
      arr.splice(arr.length - 1, 1);
    }
  }
  return arr;
};
var postProcess = postprocess;
const all_spaces = / +/g;
const ends_with_vowel = /[aeiouy]$/;
const starts_with_consonant_vowel = /^[^aeiouy]h?[aeiouy]/;
const starts_with_e_then_specials = /^e[sm]/;
const starts_with_e = /^e/;
const ends_with_noisy_vowel_combos = /(eo|eu|ia|oa|ua|ui)$/i;
const aiouy = /[aiouy]/;
const ends_with_ee = /ee$/;
const doWord = function(w) {
  let all2 = [];
  let chars = w.split("");
  let before2 = "";
  let after2 = "";
  let current = "";
  for (let i2 = 0; i2 < chars.length; i2++) {
    before2 = chars.slice(0, i2).join("");
    current = chars[i2];
    after2 = chars.slice(i2 + 1, chars.length).join("");
    let candidate = before2 + chars[i2];
    if (before2.match(ends_with_vowel) && !current.match(ends_with_vowel)) {
      if (after2.match(starts_with_e_then_specials)) {
        candidate += "e";
        after2 = after2.replace(starts_with_e, "");
      }
      all2.push(candidate);
      return all2.concat(doWord(after2));
    }
    if (candidate.match(ends_with_noisy_vowel_combos)) {
      all2.push(before2);
      all2.push(current);
      return all2.concat(doWord(after2));
    }
    if (candidate.match(ends_with_vowel) && after2.match(starts_with_consonant_vowel)) {
      all2.push(candidate);
      return all2.concat(doWord(after2));
    }
  }
  if (w.match(aiouy) || w.match(ends_with_ee)) {
    all2.push(w);
  } else if (w) {
    let last = all2.length - 1;
    if (last < 0) {
      last = 0;
    }
    all2[last] = (all2[last] || "") + w;
  }
  return all2;
};
let syllables$2 = function(str) {
  let all2 = [];
  if (!str) {
    return all2;
  }
  str = str.replace(/[.,?]/g, "");
  str.split(all_spaces).map((s2) => {
    all2 = all2.concat(doWord(s2));
  });
  all2 = postProcess(all2);
  if (all2.length === 0) {
    all2 = [str];
  }
  all2 = all2.filter((s2) => s2);
  return all2;
};
var getSyllables = syllables$2;
const syllables = function(view) {
  view.docs.forEach((terms) => {
    terms.forEach((term) => {
      term.syllables = getSyllables(term.normal || term.text);
    });
  });
};
var syllables$1 = syllables;
var compute = {
  soundsLike: soundsLike$1,
  syllables: syllables$1
};
const api = function(View2) {
  View2.prototype.syllables = function() {
    this.compute("syllables");
    let all2 = [];
    this.docs.forEach((terms) => {
      let some2 = [];
      terms.forEach((term) => {
        some2 = some2.concat(term.syllables);
      });
      if (some2.length > 0) {
        all2.push(some2);
      }
    });
    return all2;
  };
  View2.prototype.soundsLike = function() {
    this.compute("soundsLike");
    let all2 = [];
    this.docs.forEach((terms) => {
      let some2 = [];
      terms.forEach((term) => {
        some2 = some2.concat(term.soundsLike);
      });
      if (some2.length > 0) {
        all2.push(some2);
      }
    });
    return all2;
  };
};
var api$1 = api;
var speechPlugin = {
  api: api$1,
  compute
};
var iso = {
  aar: "aa",
  abk: "ab",
  afr: "af",
  aka: "ak",
  alb: "sq",
  amh: "am",
  ara: "ar",
  arg: "an",
  arm: "hy",
  asm: "as",
  ava: "av",
  ave: "ae",
  aym: "ay",
  aze: "az",
  bak: "ba",
  bam: "bm",
  baq: "eu",
  bel: "be",
  ben: "bn",
  bih: "bh",
  bis: "bi",
  bos: "bs",
  bre: "br",
  bul: "bg",
  bur: "my",
  cat: "ca",
  cha: "ch",
  che: "ce",
  chi: "zh",
  chu: "cu",
  chv: "cv",
  cor: "kw",
  cos: "co",
  cre: "cr",
  cze: "cs",
  dan: "da",
  div: "dv",
  dut: "nl",
  dzo: "dz",
  eng: "en",
  epo: "eo",
  est: "et",
  ewe: "ee",
  fao: "fo",
  fij: "fj",
  fin: "fi",
  fre: "fr",
  fry: "fy",
  ful: "ff",
  geo: "ka",
  ger: "de",
  gla: "gd",
  gle: "ga",
  glg: "gl",
  glv: "gv",
  gre: "el",
  grn: "gn",
  guj: "gu",
  hat: "ht",
  hau: "ha",
  heb: "he",
  her: "hz",
  hin: "hi",
  hmo: "ho",
  hrv: "hr",
  hun: "hu",
  ibo: "ig",
  ice: "is",
  ido: "io",
  iii: "ii",
  iku: "iu",
  ile: "ie",
  ina: "ia",
  ind: "id",
  ipk: "ik",
  ita: "it",
  jav: "jv",
  jpn: "ja",
  kal: "kl",
  kan: "kn",
  kas: "ks",
  kau: "kr",
  kaz: "kk",
  khm: "km",
  kik: "ki",
  kin: "rw",
  kir: "ky",
  kom: "kv",
  kon: "kg",
  kor: "ko",
  kua: "kj",
  kur: "ku",
  lao: "lo",
  lat: "la",
  lav: "lv",
  lim: "li",
  lin: "ln",
  lit: "lt",
  ltz: "lb",
  lub: "lu",
  lug: "lg",
  mac: "mk",
  mah: "mh",
  mal: "ml",
  mao: "mi",
  mar: "mr",
  may: "ms",
  mlg: "mg",
  mlt: "mt",
  mon: "mn",
  nau: "na",
  nav: "nv",
  nbl: "nr",
  nde: "nd",
  ndo: "ng",
  nep: "ne",
  nno: "nn",
  nob: "nb",
  nor: "no",
  nya: "ny",
  oci: "oc",
  oji: "oj",
  ori: "or",
  orm: "om",
  oss: "os",
  pan: "pa",
  per: "fa",
  pli: "pi",
  pol: "pl",
  por: "pt",
  pus: "ps",
  que: "qu",
  roh: "rm",
  rum: "ro",
  run: "rn",
  rus: "ru",
  sag: "sg",
  san: "sa",
  sin: "si",
  slo: "sk",
  slv: "sl",
  sme: "se",
  smo: "sm",
  sna: "sn",
  snd: "sd",
  som: "so",
  sot: "st",
  spa: "es",
  srd: "sc",
  srp: "sr",
  ssw: "ss",
  sun: "su",
  swa: "sw",
  swe: "sv",
  tah: "ty",
  tam: "ta",
  tat: "tt",
  tel: "te",
  tgk: "tg",
  tgl: "tl",
  tha: "th",
  tib: "bo",
  tir: "ti",
  ton: "to",
  tsn: "tn",
  tso: "ts",
  tuk: "tk",
  tur: "tr",
  twi: "tw",
  uig: "ug",
  ukr: "uk",
  urd: "ur",
  uzb: "uz",
  ven: "ve",
  vie: "vi",
  vol: "vo",
  wel: "cy",
  wln: "wa",
  wol: "wo",
  xho: "xh",
  yid: "yi",
  yor: "yo",
  zha: "za",
  zul: "zu",
  "zh-tw": "zh-tw"
}, names = {
  afar: "aa",
  abkhazian: "ab",
  afrikaans: "af",
  akan: "ak",
  albanian: "sq",
  amharic: "am",
  arabic: "ar",
  aragonese: "an",
  armenian: "hy",
  assamese: "as",
  avaric: "av",
  avestan: "ae",
  aymara: "ay",
  azerbaijani: "az",
  bashkir: "ba",
  bambara: "bm",
  basque: "eu",
  belarusian: "be",
  bengali: "bn",
  "bihari languages": "bh",
  bislama: "bi",
  tibetan: "bo",
  bosnian: "bs",
  breton: "br",
  bulgarian: "bg",
  burmese: "my",
  catalan: "ca",
  valencian: "ca",
  czech: "cs",
  chamorro: "ch",
  chechen: "ce",
  chinese: "zh",
  "church slavic": "cu",
  "old slavonic": "cu",
  "church slavonic": "cu",
  "old bulgarian": "cu",
  "old church slavonic": "cu",
  chuvash: "cv",
  cornish: "kw",
  corsican: "co",
  cree: "cr",
  welsh: "cy",
  danish: "da",
  german: "de",
  divehi: "dv",
  dhivehi: "dv",
  maldivian: "dv",
  dutch: "nl",
  flemish: "nl",
  dzongkha: "dz",
  greek: "el",
  english: "en",
  esperanto: "eo",
  estonian: "et",
  ewe: "ee",
  faroese: "fo",
  persian: "fa",
  fijian: "fj",
  finnish: "fi",
  french: "fr",
  "western frisian": "fy",
  fulah: "ff",
  georgian: "ka",
  gaelic: "gd",
  "scottish gaelic": "gd",
  irish: "ga",
  galician: "gl",
  manx: "gv",
  guarani: "gn",
  gujarati: "gu",
  haitian: "ht",
  "haitian creole": "ht",
  hausa: "ha",
  hebrew: "he",
  herero: "hz",
  hindi: "hi",
  "hiri motu": "ho",
  croatian: "hr",
  hungarian: "hu",
  igbo: "ig",
  icelandic: "is",
  ido: "io",
  "sichuan yi": "ii",
  nuosu: "ii",
  inuktitut: "iu",
  interlingue: "ie",
  occidental: "ie",
  interlingua: "ia",
  indonesian: "id",
  inupiaq: "ik",
  italian: "it",
  javanese: "jv",
  japanese: "ja",
  kalaallisut: "kl",
  greenlandic: "kl",
  kannada: "kn",
  kashmiri: "ks",
  kanuri: "kr",
  kazakh: "kk",
  "central khmer": "km",
  kikuyu: "ki",
  gikuyu: "ki",
  kinyarwanda: "rw",
  kirghiz: "ky",
  kyrgyz: "ky",
  komi: "kv",
  kongo: "kg",
  korean: "ko",
  kuanyama: "kj",
  kwanyama: "kj",
  kurdish: "ku",
  lao: "lo",
  latin: "la",
  latvian: "lv",
  limburgan: "li",
  limburger: "li",
  limburgish: "li",
  lingala: "ln",
  lithuanian: "lt",
  luxembourgish: "lb",
  letzeburgesch: "lb",
  "luba-katanga": "lu",
  ganda: "lg",
  macedonian: "mk",
  marshallese: "mh",
  malayalam: "ml",
  maori: "mi",
  marathi: "mr",
  malay: "ms",
  malagasy: "mg",
  maltese: "mt",
  mongolian: "mn",
  nauru: "na",
  navajo: "nv",
  navaho: "nv",
  "ndebele, south": "nr",
  "south ndebele": "nr",
  "ndebele, north": "nd",
  "north ndebele": "nd",
  ndonga: "ng",
  nepali: "ne",
  "norwegian nynorsk": "nn",
  "nynorsk, norwegian": "nn",
  "norwegian bokm\xE5l": "nb",
  "bokm\xE5l, norwegian": "nb",
  norwegian: "no",
  chichewa: "ny",
  chewa: "ny",
  nyanja: "ny",
  occitan: "oc",
  ojibwa: "oj",
  oriya: "or",
  oromo: "om",
  ossetian: "os",
  ossetic: "os",
  panjabi: "pa",
  punjabi: "pa",
  pali: "pi",
  polish: "pl",
  portuguese: "pt",
  pushto: "ps",
  pashto: "ps",
  quechua: "qu",
  romansh: "rm",
  romanian: "ro",
  moldavian: "ro",
  moldovan: "ro",
  rundi: "rn",
  russian: "ru",
  sango: "sg",
  sanskrit: "sa",
  sinhala: "si",
  sinhalese: "si",
  slovak: "sk",
  slovenian: "sl",
  "northern sami": "se",
  samoan: "sm",
  shona: "sn",
  sindhi: "sd",
  somali: "so",
  "sotho, southern": "st",
  spanish: "es",
  castilian: "es",
  sardinian: "sc",
  serbian: "sr",
  swati: "ss",
  sundanese: "su",
  swahili: "sw",
  swedish: "sv",
  tahitian: "ty",
  tamil: "ta",
  tatar: "tt",
  telugu: "te",
  tajik: "tg",
  tagalog: "tl",
  thai: "th",
  tigrinya: "ti",
  tonga: "to",
  tswana: "tn",
  tsonga: "ts",
  turkmen: "tk",
  turkish: "tr",
  twi: "tw",
  uighur: "ug",
  uyghur: "ug",
  ukrainian: "uk",
  urdu: "ur",
  uzbek: "uz",
  venda: "ve",
  vietnamese: "vi",
  volap\u00FCk: "vo",
  walloon: "wa",
  wolof: "wo",
  xhosa: "xh",
  yiddish: "yi",
  yoruba: "yo",
  zhuang: "za",
  chuang: "za",
  zulu: "zu"
};
const isoKeys = Object.values(iso).sort();
var languages = (e2) => {
  if ("string" != typeof e2)
    throw new Error('The "language" must be a string, received ' + typeof e2);
  if (e2.length > 100)
    throw new Error(`The "language" is too long at ${e2.length} characters`);
  if (e2 = e2.toLowerCase(), e2 = names[e2] || iso[e2] || e2, !isoKeys.includes(e2))
    throw new Error(`The language "${e2}" is not part of the ISO 639-1`);
  return e2;
};
function Cache() {
  var e2 = /* @__PURE__ */ Object.create(null);
  function a2(a3) {
    delete e2[a3];
  }
  this.set = function(n2, i2, r2) {
    if (void 0 !== r2 && ("number" != typeof r2 || isNaN(r2) || r2 <= 0))
      throw new Error("Cache timeout must be a positive number");
    var t2 = e2[n2];
    t2 && clearTimeout(t2.timeout);
    var o2 = { value: i2, expire: r2 + Date.now() };
    return isNaN(o2.expire) || (o2.timeout = setTimeout(() => a2(n2), r2)), e2[n2] = o2, i2;
  }, this.del = function(n2) {
    var i2 = true, r2 = e2[n2];
    return r2 ? (clearTimeout(r2.timeout), !isNaN(r2.expire) && r2.expire < Date.now() && (i2 = false)) : i2 = false, i2 && a2(n2), i2;
  }, this.clear = function() {
    for (var a3 in e2)
      clearTimeout(e2[a3].timeout);
    e2 = /* @__PURE__ */ Object.create(null);
  }, this.get = function(a3) {
    var n2 = e2[a3];
    if (void 0 !== n2) {
      if (isNaN(n2.expire) || n2.expire >= Date.now())
        return n2.value;
      delete e2[a3];
    }
    return null;
  };
}
const exp$1 = new Cache();
exp$1.Cache = Cache;
const base = "https://translate.googleapis.com/translate_a/single";
var google = {
  fetch: ({ key: e2, from: a2, to: n2, text: i2 }) => [
    `${base}?client=gtx&sl=${a2}&tl=${n2}&dt=t&q=${encodeURI(i2)}`
  ],
  parse: (e2) => e2.json().then((e3) => {
    if (!(e3 = e3 && e3[0] && e3[0][0] && e3[0].map((e4) => e4[0]).join("")))
      throw new Error("Translation not found");
    return e3;
  })
}, yandex = {
  needkey: true,
  fetch: ({ key: e2, from: a2, to: n2, text: i2 }) => [
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${e2}&lang=${a2}-${n2}&text=${encodeURIComponent(
      i2
    )}`,
    { method: "POST", body: "" }
  ],
  parse: (e2) => e2.json().then((e3) => {
    if (200 !== e3.code)
      throw new Error(e3.message);
    return e3.text[0];
  })
};
const libreUrl = "https://libretranslate.com/translate";
var libre = {
  needkey: false,
  fetch: ({ url: e2 = libreUrl, key: a2, from: n2, to: i2, text: r2 }) => [
    e2,
    {
      method: "POST",
      body: JSON.stringify({ q: r2, source: n2, target: i2, api_key: a2 }),
      headers: { "Content-Type": "application/json" }
    }
  ],
  parse: (e2) => e2.json().then((e3) => {
    if (!e3)
      throw new Error("No response found");
    if (e3.error)
      throw new Error(e3.error);
    if (!e3.translatedText)
      throw new Error("No response found");
    return e3.translatedText;
  })
}, deepl = {
  needkey: true,
  fetch: ({ key: e2, from: a2, to: n2, text: i2 }) => [
    `https://api${/:fx$/.test(e2) ? "-free" : ""}.deepl.com/v2/translate?auth_key=${e2}&source_lang=${a2}&target_lang=${n2}&text=${i2 = encodeURIComponent(i2)}`,
    { method: "POST", body: "" }
  ],
  parse: async (e2) => {
    if (!e2.ok) {
      if (403 === e2.status)
        throw new Error("Auth Error, please review the key for DeepL");
      throw new Error(`Error ${e2.status}`);
    }
    return e2.json().then((e3) => e3.translations[0].text);
  }
}, engines = { google, yandex, libre, deepl };
const Translate = function(e2 = {}) {
  if (!(this instanceof Translate))
    return new Translate(e2);
  const a2 = {
    from: "en",
    to: "en",
    cache: void 0,
    languages,
    engines,
    engine: "google",
    keys: {}
  }, n2 = async (e3, a3 = {}) => {
    "string" == typeof a3 && (a3 = { to: a3 }), a3.text = e3, a3.from = languages(a3.from || n2.from), a3.to = languages(a3.to || n2.to), a3.cache = a3.cache || n2.cache, a3.engines = a3.engines || {}, a3.engine = a3.engine || n2.engine, a3.url = a3.url || n2.url, a3.id = a3.id || `${a3.url}:${a3.from}:${a3.to}:${a3.engine}:${a3.text}`, a3.keys = a3.keys || n2.keys || {};
    for (let e4 in n2.keys)
      a3.keys[e4] = a3.keys[e4] || n2.keys[e4];
    a3.key = a3.key || n2.key || a3.keys[a3.engine];
    const i2 = a3.engines[a3.engine] || n2.engines[a3.engine], r2 = exp$1.get(a3.id);
    if (r2)
      return Promise.resolve(r2);
    if (a3.to === a3.from)
      return Promise.resolve(a3.text);
    if (i2.needkey && !a3.key)
      throw new Error(`The engine "${a3.engine}" needs a key, please provide it`);
    const t2 = i2.fetch(a3);
    return fetch(...t2).then(i2.parse).then((e4) => exp$1.set(a3.id, e4, a3.cache));
  };
  for (let i2 in a2)
    n2[i2] = void 0 === e2[i2] ? a2[i2] : e2[i2];
  return n2;
}, exp = new Translate();
exp.Translate = Translate;
nlp$1.plugin(speechPlugin);
function checkAnswer(text2, indices, answer) {
  const correct = text2.slice(indices[0], indices[1]).toLowerCase() === answer.trim().toLowerCase();
  return { correct, hint: "" };
}
var VideoOverlay_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n2) => (pushScopeId("data-v-24d6b3d0"), n2 = n2(), popScopeId(), n2);
const _hoisted_1 = {
  class: "q-pa-sm",
  id: "video-overlay"
};
const _hoisted_2 = { style: { "flex-grow": "1" } };
const _hoisted_3 = { class: "text-body2" };
const _hoisted_4 = ["href"];
const _hoisted_5 = { class: "text-body2" };
const _hoisted_6 = ["href"];
const _hoisted_7 = { class: "text-body2" };
const _hoisted_8 = ["href"];
const _hoisted_9 = {
  class: "subtitles-div",
  style: { "flex-grow": "0" }
};
const _hoisted_10 = {
  key: 0,
  class: "q-ml-lg"
};
const _hoisted_11 = { style: { "flex-grow": "0" } };
const _hoisted_12 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "q-ml-sm" }, "Do you want to delete this review?", -1));
const _sfc_main = defineComponent({
  __name: "VideoOverlay",
  setup(__props) {
    const $q = useQuasar();
    let extensionId;
    let reviewUrl = chrome.runtime.getURL("www/index.html#practice-review");
    let upgradeAccountUrl = chrome.runtime.getURL("www/index.html#upgrade-account");
    let subtitle;
    let isReviewing = false;
    const practiceResultAnalysis = ref("");
    const practiceResultId = ref();
    const isAnalyzingPracticeResult = ref(false);
    const subtitleDisplayUnits = ref([]);
    const inputElements = ref({});
    const invisibleSpan = ref();
    const lastSubmitTime = ref(0);
    const showDeletePracticeReviewDialog = ref(false);
    let firstInputDisplayIdx = ref(-1);
    let config;
    let userInfo = ref();
    let tokens = ref();
    let isShowingAnswer = false;
    let dismissNotification = null;
    let previousSentenceText = "";
    let nextSentenceText = "";
    watch(firstInputDisplayIdx, (newIdx) => {
      nextTick(() => {
        if (inputElements.value.hasOwnProperty(newIdx) && inputElements.value[newIdx]) {
          inputElements.value[newIdx].nativeEl.focus();
        }
      });
    });
    function extractSubtitleDisplayUnits(subtitle2) {
      if (!("blankedOutWordIndices" in subtitle2) || subtitle2.blankedOutWordIndices.length === 0) {
        return [
          {
            type: "text",
            text: subtitle2.text,
            indices: [0, subtitle2.text.length]
          }
        ];
      }
      const subtitleDisplayUnits2 = [];
      for (const [isBlankedOut, start2, end2] of traverseSubsegments(
        subtitle2.blankedOutWordIndices,
        subtitle2.text.length
      )) {
        subtitleDisplayUnits2.push({
          unitIndex: subtitleDisplayUnits2.length,
          type: isBlankedOut ? "input" : "text",
          text: subtitle2.text.substring(start2, end2),
          indices: [start2, end2],
          filledIn: ""
        });
      }
      return subtitleDisplayUnits2;
    }
    function setInputWidth(idx, text2 = "") {
      const inputElement = inputElements.value[idx];
      invisibleSpan.value.innerText = text2.length > 0 ? text2 : inputElement.nativeEl.value;
      let newWidth = invisibleSpan.value.offsetWidth;
      if (newWidth > 60) {
        newWidth = Math.min(newWidth, 250);
        inputElement.nativeEl.style.width = `${newWidth + 6}px`;
      } else if (newWidth === 0) {
        inputElement.nativeEl.style.width = "60px";
      }
    }
    function submitAnswers(forceSubmit = false) {
      const inputDisplayUnits = subtitleDisplayUnits.value.filter(
        (displayUnit) => displayUnit.type === "input"
      );
      if (!forceSubmit && inputDisplayUnits.every(
        (displayUnit) => !displayUnit.filledIn || displayUnit.filledIn.trim() === ""
      )) {
        return;
      }
      const checkResults = inputDisplayUnits.map((displayUnit) => {
        return checkAnswer(subtitle.text, displayUnit.indices, displayUnit.filledIn);
      });
      const correct = checkResults.every((result) => result.correct);
      const answers = inputDisplayUnits.map((displayUnit) => displayUnit.filledIn);
      if (correct) {
        const audio = new Audio(chrome.runtime.getURL("assets/success.mp3"));
        audio.play();
        audio.onended = () => {
          audio.remove();
          window.parent.postMessage({ message: "practiceAnswersCorrect", index: subtitle.index }, "*");
        };
      } else {
        for (let i2 = 0; i2 < checkResults.length; i2++) {
          if (checkResults[i2].correct)
            continue;
          const unitIdx = inputDisplayUnits[i2].unitIndex;
          inputDisplayUnits[i2].filledIn = "";
          inputElements.value[unitIdx].nativeEl.style.width = "60px";
        }
      }
      lastSubmitTime.value = Date.now();
      const thisSubmitTime = lastSubmitTime.value;
      chrome.runtime.sendMessage(
        extensionId,
        {
          message: "practiceAnswersSubmitted",
          sentenceSubtitleId: subtitle.dbId,
          blankOutIndices: subtitle.blankedOutWordIndices,
          checkResults,
          answers,
          practiceMode: subtitle.practiceMode,
          translation: subtitle.translation,
          isReviewing
        },
        (res) => {
          if (thisSubmitTime !== lastSubmitTime.value)
            return;
          practiceResultId.value = res.practiceResultId;
        }
      );
    }
    function handleSubmitAnswers(event) {
      if (event instanceof KeyboardEvent && event.shiftKey && event.key === "Enter") {
        practiceResultId.value = void 0;
        submitAnswers();
      } else if (event instanceof PointerEvent) {
        practiceResultId.value = void 0;
        submitAnswers();
      }
    }
    function focusNextInput(displayUnitIdx) {
      let nextUnitIdx = displayUnitIdx + 1;
      while (!(inputElements.value.hasOwnProperty(nextUnitIdx) && inputElements.value[nextUnitIdx])) {
        nextUnitIdx++;
        if (nextUnitIdx >= subtitleDisplayUnits.value.length) {
          nextUnitIdx = 0;
        }
      }
      inputElements.value[nextUnitIdx].nativeEl.focus();
    }
    function skipPractice() {
      if (!isReviewing) {
        window.parent.postMessage({ message: "skipPractice", index: subtitle.index }, "*");
      } else {
        window.parent.postMessage({ message: "skipReview", index: subtitle.index }, "*");
      }
    }
    function replay() {
      window.parent.postMessage({ message: "replaySentenceSubtitle", index: subtitle.index }, "*");
    }
    function reset2() {
      isShowingAnswer = false;
      firstInputDisplayIdx.value = -1;
      if (dismissNotification) {
        dismissNotification();
      }
      practiceResultAnalysis.value = "";
      practiceResultId.value = void 0;
      previousSentenceText = "";
      nextSentenceText = "";
      isAnalyzingPracticeResult.value = false;
      lastSubmitTime.value = 0;
    }
    function handleShowVideoOverlay(event) {
      if (!(event instanceof MessageEvent))
        return;
      if (event.data.message !== "showVideoOverlay")
        return;
      extensionId = event.data.extensionId;
      chrome.runtime.sendMessage(extensionId, { message: "storage.get", key: "user-config" }, (res) => {
        config = res;
        if (config.nativeLanguage === "en" || config.nativeLanguage === "") {
          dismissNotification = $q.notify({
            message: "Please click the extension icon to set your native language, and refresh the page.",
            timeout: 8e3,
            progress: true,
            type: "warning",
            position: "center"
          });
        }
      });
      subtitle = event.data.subtitle;
      if (event.data.isReviewing) {
        isReviewing = true;
      }
      subtitleDisplayUnits.value = extractSubtitleDisplayUnits(subtitle);
      firstInputDisplayIdx.value = subtitleDisplayUnits.value.findIndex(
        (displayUnit) => displayUnit.type === "input"
      );
    }
    function RevealAnswer() {
      const inputDisplayUnits = subtitleDisplayUnits.value.filter(
        (displayUnit) => displayUnit.type === "input"
      );
      if (isReviewing) {
        submitAnswers(true);
      }
      for (let i2 = 0; i2 < inputDisplayUnits.length; i2++) {
        inputDisplayUnits[i2].filledIn = inputDisplayUnits[i2].text;
        setInputWidth(inputDisplayUnits[i2].unitIndex, inputDisplayUnits[i2].text);
      }
      isShowingAnswer = true;
      dismissNotification = $q.notify({
        message: isReviewing ? 'Click the "Skip" button to review the next one' : 'Click the "Skip" button to continue watching',
        timeout: 4e3,
        progress: true,
        type: "positive",
        position: "center"
      });
    }
    function deletePracticeReview() {
      window.parent.postMessage({ message: "deletePracticeReview", reviewId: subtitle.reviewId }, "*");
    }
    function analyzePracticeResult() {
      if (!userInfo.value)
        return;
      practiceResultAnalysis.value = "";
      isAnalyzingPracticeResult.value = true;
      api$D.post(
        "/analyze-answers",
        {
          practiceResultId: practiceResultId.value,
          previousSentenceText,
          sentenceText: subtitle.text,
          nextSentenceText,
          language: LanguageManager.getLanguageName(config.nativeLanguage)
        },
        { responseType: "stream", params: { useFetch: true } }
      ).then((response) => {
        practiceResultId.value = void 0;
        isAnalyzingPracticeResult.value = false;
        const reader = response.getReader();
        reader.read().then(function processText({
          done,
          value
        }) {
          if (done) {
            if (practiceResultAnalysis.value.startsWith("{")) {
              const result = JSON.parse(
                practiceResultAnalysis.value
              );
              if (result.error_code && result.error_code === BackendErrorCode.ExceedPracticeAnalysisLimit) {
                practiceResultAnalysis.value = result.message;
                updateUserInfo({
                  allowNewPracticeResultAnalysis: false
                });
              }
            }
            return;
          }
          practiceResultAnalysis.value += new TextDecoder("utf-8").decode(value);
          return reader.read().then(processText);
        });
      }).catch((err) => {
        isAnalyzingPracticeResult.value = false;
        console.error(err);
      });
    }
    window.addEventListener("message", async (event) => {
      if (event.data.message === "showVideoOverlay") {
        reset2();
        userInfo.value = await getUserInfo();
        tokens.value = await getSupabaseTokens();
        handleShowVideoOverlay(event);
      }
    });
    onMounted(() => {
      practiceResultId.value = void 0;
      window.parent.postMessage({ message: "videoOverlayIframeLoaded" }, "*");
      analyzePracticeResult();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("span", {
          ref_key: "invisibleSpan",
          ref: invisibleSpan,
          style: { "position": "absolute", "left": "-100%" }
        }, null, 512),
        createBaseVNode("div", _hoisted_2, [
          withDirectives(createBaseVNode("p", _hoisted_3, [
            createTextVNode(" * You can save your practice results and review them later if you "),
            createBaseVNode("a", {
              href: unref(reviewUrl),
              target: "_blank",
              class: "text-info"
            }, " log in.", 8, _hoisted_4)
          ], 512), [
            [vShow, !unref(userInfo) || !unref(tokens) || !unref(tokens).access_token]
          ]),
          withDirectives(createBaseVNode("p", _hoisted_5, [
            createTextVNode(" * You have reached the maximum number of free practice reviews. You can still do new practices and review the old ones, but you won't be able to review the incorrect new ones again. "),
            createBaseVNode("a", {
              href: unref(upgradeAccountUrl),
              target: "_blank",
              class: "text-info"
            }, " Remove the limit.", 8, _hoisted_6)
          ], 512), [
            [vShow, unref(userInfo) && !unref(userInfo).isPremium && !unref(userInfo).allowNewPracticeReviews]
          ]),
          withDirectives(createBaseVNode("p", _hoisted_7, [
            createTextVNode(" * You have reached the maximum number of free practice result analysis. "),
            createBaseVNode("a", {
              href: unref(upgradeAccountUrl),
              target: "_blank",
              class: "text-info"
            }, " Remove the limit.", 8, _hoisted_8)
          ], 512), [
            [vShow, unref(userInfo) && !unref(userInfo).isPremium && !unref(userInfo).allowNewPracticeResultAnalysis]
          ])
        ]),
        withDirectives(createBaseVNode("p", { class: "result-analysis" }, toDisplayString(practiceResultAnalysis.value), 513), [
          [vShow, practiceResultAnalysis.value]
        ]),
        createBaseVNode("div", _hoisted_9, [
          createBaseVNode("p", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(subtitleDisplayUnits.value, (enDisplayUnit, idx) => {
              return openBlock(), createElementBlock(Fragment, null, [
                enDisplayUnit.type === "text" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(enDisplayUnit.text), 1)
                ], 64)) : (openBlock(), createBlock(unref(QInput), {
                  modelValue: enDisplayUnit.filledIn,
                  "onUpdate:modelValue": [($event) => enDisplayUnit.filledIn = $event, ($event) => setInputWidth(idx)],
                  dark: "",
                  dense: "",
                  key: idx,
                  class: "answer-q-input",
                  "input-style": { width: "60px" },
                  ref_for: true,
                  ref: (el) => inputElements.value[idx] = el,
                  onKeydown: [
                    withKeys(withModifiers(($event) => focusNextInput(idx), ["prevent"]), ["space"]),
                    withKeys(withModifiers(handleSubmitAnswers, ["prevent"]), ["enter"])
                  ],
                  onKeydownOnce: handleSubmitAnswers,
                  disable: unref(isShowingAnswer)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown", "disable"]))
              ], 64);
            }), 256))
          ]),
          unref(subtitle) && unref(subtitle).translation.length > 0 ? (openBlock(), createElementBlock("p", _hoisted_10, toDisplayString(unref(subtitle).translation), 1)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_11, [
          createVNode(QBtn, {
            size: "xs",
            color: "grey-5",
            icon: "fa-solid fa-trash",
            rounded: "",
            onClick: _cache[0] || (_cache[0] = ($event) => showDeletePracticeReviewDialog.value = true),
            class: normalizeClass({ "q-mr-xl": true, visible: unref(isReviewing), invisible: !unref(isReviewing) })
          }, {
            default: withCtx(() => [
              createVNode(QTooltip, {
                anchor: "top middle",
                self: "bottom middle",
                class: "bg-grey-5"
              }, {
                default: withCtx(() => [
                  createTextVNode("Delete Review ")
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["class"]),
          createVNode(QBtn, {
            color: "secondary",
            icon: "skip_next",
            onClick: skipPractice,
            round: "",
            size: "xs",
            class: "q-mr-xl"
          }, {
            default: withCtx(() => [
              createVNode(QTooltip, {
                anchor: "top middle",
                self: "bottom middle",
                class: "bg-secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(isReviewing) ? "Next Review" : "Skip Practice"), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(QBtn, {
            class: normalizeClass({ "q-mr-xl": true, visible: !unref(isShowingAnswer), invisible: unref(isShowingAnswer) }),
            color: "primary",
            label: "Submit",
            onClick: handleSubmitAnswers,
            rounded: "",
            size: "md"
          }, null, 8, ["class"]),
          createVNode(QBtn, {
            size: "sm",
            color: "grey-5",
            label: "Reveal",
            rounded: "",
            onClick: RevealAnswer,
            class: normalizeClass({ "q-mr-xl": true, visible: !unref(isShowingAnswer), invisible: unref(isShowingAnswer) })
          }, null, 8, ["class"]),
          withDirectives(createVNode(QBtn, {
            color: "secondary",
            icon: "replay",
            onClick: replay,
            round: "",
            size: "xs",
            class: normalizeClass({ "q-mr-xl": true })
          }, {
            default: withCtx(() => [
              createVNode(QTooltip, {
                anchor: "top middle",
                self: "bottom middle",
                class: "bg-secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode("Replay Sentence ")
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 512), [
            [vShow, unref(subtitle) && unref(subtitle).practiceMode === unref(PracticeMode).Dictate && !unref(isReviewing)]
          ]),
          createVNode(QBtn, {
            loading: isAnalyzingPracticeResult.value,
            label: "Analyze",
            color: "primary",
            size: "sm",
            onClick: analyzePracticeResult,
            rounded: "",
            disable: practiceResultId.value === void 0 || !unref(userInfo) || !unref(userInfo).isPremium && !unref(userInfo).allowNewPracticeResultAnalysis
          }, null, 8, ["loading", "disable"])
        ]),
        createVNode(QDialog, {
          modelValue: showDeletePracticeReviewDialog.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showDeletePracticeReviewDialog.value = $event),
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(QCard, null, {
              default: withCtx(() => [
                createVNode(QCardSection, { class: "row items-center" }, {
                  default: withCtx(() => [
                    _hoisted_12
                  ]),
                  _: 1
                }),
                createVNode(QCardActions, { align: "right" }, {
                  default: withCtx(() => [
                    withDirectives(createVNode(QBtn, {
                      flat: "",
                      label: "Cancel",
                      color: "primary"
                    }, null, 512), [
                      [ClosePopup]
                    ]),
                    withDirectives(createVNode(QBtn, {
                      flat: "",
                      label: "Delete",
                      color: "grey-5",
                      onClick: deletePracticeReview
                    }, null, 512), [
                      [ClosePopup]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
});
var VideoOverlay = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-24d6b3d0"]]);
export { VideoOverlay as default };
