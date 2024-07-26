import { Q as QSeparator } from "./QSeparator.78b1de89.js";
import { h as api, a as getUserInfo, u as uniqueBy, W as WebsiteSource, P as PracticeMode } from "./axios.ead55ef2.js";
import { m as computed, l as createComponent, r as ref, E as watch, x as onBeforeUnmount, n as h, ag as Transition, p as hSlot, ah as QSpinner, d as defineComponent, s as onMounted, h as openBlock, c as createElementBlock, w as withDirectives, v as vShow, a as createBaseVNode, F as Fragment, g as renderList, a2 as createBlock, f as withCtx, e as createVNode, a3 as createTextVNode, t as toDisplayString, a0 as _export_sfc, ai as pushScopeId, aj as popScopeId, i as inject, ak as useRouter, a1 as resolveComponent, u as unref, k as createCommentVNode, al as toRaw } from "./index.454a89f7.js";
import { Q as QChip } from "./QChip.02824bab.js";
import { Q as QCardSection, a as QCard } from "./QCard.c4835b97.js";
import "./use-dark.a20bd128.js";
const useRatioProps = {
  ratio: [String, Number]
};
function useRatio(props, naturalRatio) {
  return computed(() => {
    const ratio = Number(
      props.ratio || (naturalRatio !== void 0 ? naturalRatio.value : void 0)
    );
    return isNaN(ratio) !== true && ratio > 0 ? { paddingBottom: `${100 / ratio}%` } : null;
  });
}
const defaultRatio = 16 / 9;
var QImg = createComponent({
  name: "QImg",
  props: {
    ...useRatioProps,
    src: String,
    srcset: String,
    sizes: String,
    alt: String,
    crossorigin: String,
    decoding: String,
    referrerpolicy: String,
    draggable: Boolean,
    loading: {
      type: String,
      default: "lazy"
    },
    fetchpriority: {
      type: String,
      default: "auto"
    },
    width: String,
    height: String,
    initialRatio: {
      type: [Number, String],
      default: defaultRatio
    },
    placeholderSrc: String,
    fit: {
      type: String,
      default: "cover"
    },
    position: {
      type: String,
      default: "50% 50%"
    },
    imgClass: String,
    imgStyle: Object,
    noSpinner: Boolean,
    noNativeMenu: Boolean,
    noTransition: Boolean,
    spinnerColor: String,
    spinnerSize: String
  },
  emits: ["load", "error"],
  setup(props, { slots, emit }) {
    const naturalRatio = ref(props.initialRatio);
    const ratioStyle = useRatio(props, naturalRatio);
    let loadTimer = null, isDestroyed = false;
    const images = [
      ref(null),
      ref(getPlaceholderSrc())
    ];
    const position = ref(0);
    const isLoading = ref(false);
    const hasError = ref(false);
    const classes = computed(
      () => `q-img q-img--${props.noNativeMenu === true ? "no-" : ""}menu`
    );
    const style = computed(() => ({
      width: props.width,
      height: props.height
    }));
    const imgClass = computed(
      () => `q-img__image ${props.imgClass !== void 0 ? props.imgClass + " " : ""}q-img__image--with${props.noTransition === true ? "out" : ""}-transition`
    );
    const imgStyle = computed(() => ({
      ...props.imgStyle,
      objectFit: props.fit,
      objectPosition: props.position
    }));
    watch(() => getCurrentSrc(), addImage);
    function getCurrentSrc() {
      return props.src || props.srcset || props.sizes ? {
        src: props.src,
        srcset: props.srcset,
        sizes: props.sizes
      } : null;
    }
    function getPlaceholderSrc() {
      return props.placeholderSrc !== void 0 ? { src: props.placeholderSrc } : null;
    }
    function addImage(imgProps) {
      if (loadTimer !== null) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }
      hasError.value = false;
      if (imgProps === null) {
        isLoading.value = false;
        images[position.value ^ 1].value = getPlaceholderSrc();
      } else {
        isLoading.value = true;
      }
      images[position.value].value = imgProps;
    }
    function onLoad({ target }) {
      if (isDestroyed === true) {
        return;
      }
      if (loadTimer !== null) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }
      naturalRatio.value = target.naturalHeight === 0 ? 0.5 : target.naturalWidth / target.naturalHeight;
      waitForCompleteness(target, 1);
    }
    function waitForCompleteness(target, count) {
      if (isDestroyed === true || count === 1e3) {
        return;
      }
      if (target.complete === true) {
        onReady(target);
      } else {
        loadTimer = setTimeout(() => {
          loadTimer = null;
          waitForCompleteness(target, count + 1);
        }, 50);
      }
    }
    function onReady(img) {
      if (isDestroyed === true) {
        return;
      }
      position.value = position.value ^ 1;
      images[position.value].value = null;
      isLoading.value = false;
      hasError.value = false;
      emit("load", img.currentSrc || img.src);
    }
    function onError(err) {
      if (loadTimer !== null) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }
      isLoading.value = false;
      hasError.value = true;
      images[position.value].value = null;
      images[position.value ^ 1].value = getPlaceholderSrc();
      emit("error", err);
    }
    function getImage(index) {
      const img = images[index].value;
      const data = {
        key: "img_" + index,
        class: imgClass.value,
        style: imgStyle.value,
        crossorigin: props.crossorigin,
        decoding: props.decoding,
        referrerpolicy: props.referrerpolicy,
        height: props.height,
        width: props.width,
        loading: props.loading,
        fetchpriority: props.fetchpriority,
        "aria-hidden": "true",
        draggable: props.draggable,
        ...img
      };
      if (position.value === index) {
        data.class += " q-img__image--waiting";
        Object.assign(data, { onLoad, onError });
      } else {
        data.class += " q-img__image--loaded";
      }
      return h(
        "div",
        { class: "q-img__container absolute-full", key: "img" + index },
        h("img", data)
      );
    }
    function getContent() {
      if (isLoading.value !== true) {
        return h("div", {
          key: "content",
          class: "q-img__content absolute-full q-anchor--skip"
        }, hSlot(slots[hasError.value === true ? "error" : "default"]));
      }
      return h("div", {
        key: "loading",
        class: "q-img__loading absolute-full flex flex-center"
      }, slots.loading !== void 0 ? slots.loading() : props.noSpinner === true ? void 0 : [
        h(QSpinner, {
          color: props.spinnerColor,
          size: props.spinnerSize
        })
      ]);
    }
    {
      {
        addImage(getCurrentSrc());
      }
      onBeforeUnmount(() => {
        isDestroyed = true;
        if (loadTimer !== null) {
          clearTimeout(loadTimer);
          loadTimer = null;
        }
      });
    }
    return () => {
      const content = [];
      if (ratioStyle.value !== null) {
        content.push(
          h("div", { key: "filler", style: ratioStyle.value })
        );
      }
      if (hasError.value !== true) {
        if (images[0].value !== null) {
          content.push(getImage(0));
        }
        if (images[1].value !== null) {
          content.push(getImage(1));
        }
      }
      content.push(
        h(Transition, { name: "q-transition--fade" }, getContent)
      );
      return h("div", {
        class: classes.value,
        style: style.value,
        role: "img",
        "aria-label": props.alt
      }, content);
    };
  }
});
var AuthorRecommendation_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-0b57b1f7"), n = n(), popScopeId(), n);
const _hoisted_1$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "text-h4 text-center q-my-lg" }, "Youtubers With Many Subtitled Videos", -1));
const _hoisted_2$1 = { class: "recommended-authors-container" };
const _hoisted_3$1 = ["href"];
const _hoisted_4$1 = { class: "absolute-top" };
const _hoisted_5$1 = { class: "absolute-bottom text-h6 text-white" };
const _sfc_main$1 = defineComponent({
  __name: "AuthorRecommendation",
  setup(__props) {
    const authors = ref([]);
    onMounted(async () => {
      const res = await api.get("/recommended-authors", { params: { addAccessToken: false } });
      if (res.success) {
        authors.value = res.data;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _hoisted_1$1,
        withDirectives(createBaseVNode("div", _hoisted_2$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(authors.value, (author, idx) => {
            return openBlock(), createBlock(QCard, {
              class: "author-card",
              key: idx
            }, {
              default: withCtx(() => [
                createBaseVNode("a", {
                  href: author.url,
                  target: "_blank"
                }, [
                  createVNode(QImg, {
                    src: author.logo
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("p", _hoisted_4$1, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(author.tags, (tag, tagIdx) => {
                          return openBlock(), createBlock(QChip, {
                            dense: "",
                            "text-color": "white",
                            color: "teal",
                            key: tagIdx
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      createBaseVNode("div", _hoisted_5$1, toDisplayString(author.name), 1)
                    ]),
                    _: 2
                  }, 1032, ["src"])
                ], 8, _hoisted_3$1),
                createVNode(QCardSection, null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(author.description), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, 1024);
          }), 128))
        ], 512), [
          [vShow, authors.value.length > 0]
        ])
      ], 64);
    };
  }
});
var AuthorRecommendation = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0b57b1f7"]]);
var PracticeReview_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1 = { class: "full-height full-width q-px-md" };
const _hoisted_2 = { class: "q-py-md" };
const _hoisted_3 = {
  key: 0,
  id: "video-container"
};
const _hoisted_4 = ["src"];
const _hoisted_5 = ["src"];
const _hoisted_6 = {
  key: 1,
  class: "text-body1 q-ml-md"
};
const GET_REMOTE_REVIEWS_THRESHOLD = 10;
const _sfc_main = defineComponent({
  __name: "PracticeReview",
  setup(__props) {
    const bus = inject("bus");
    const videoOverlayUrl = chrome.runtime.getURL("www/index.html#video-overlay");
    let videoOverlayIframeLoaded = false;
    const user = ref();
    const reviews = ref([]);
    const router = useRouter();
    async function getReviewsFromRemote() {
      const resp = await api.get("/practice-reviews");
      if (resp.success) {
        return resp.data.map((r) => {
          return {
            text: r.text,
            blankedOutWordIndices: r.blank_indices,
            translation: r.translation,
            practiceMode: inferPracticeMode(r.text, r.blank_indices),
            dbId: r.sentence_id,
            start: r.estimated_start,
            duration: r.estimated_duration,
            source: r.source,
            sourceId: r.source_id,
            reviewId: r.id
          };
        });
      }
      return [];
    }
    async function shiftReviews() {
      reviews.value.shift();
      if (reviews.value.length <= GET_REMOTE_REVIEWS_THRESHOLD) {
        const remoteReviews = await getReviewsFromRemote();
        reviews.value = uniqueBy([...reviews.value, ...remoteReviews], (r) => r.dbId);
      }
    }
    function createVideoUrl(source, sourceId, start = void 0) {
      if (source === WebsiteSource.Youtube) {
        let baseURI = `https://www.youtube.com/embed/${sourceId}`;
        if (start !== void 0) {
          baseURI += `?start=${Math.floor(start / 1e3)}`;
        }
        return baseURI;
      }
      return "";
    }
    function inferPracticeMode(text, blankedOutWordIndices) {
      const numOfWords = text.split(" ").length;
      if (blankedOutWordIndices.length / numOfWords > 0.3) {
        return PracticeMode.Dictate;
      }
      return PracticeMode.BlankOut;
    }
    window.addEventListener("message", (event) => {
      if (event.data.message === "videoOverlayIframeLoaded") {
        videoOverlayIframeLoaded = true;
      } else if (event.data.message === "practiceAnswersCorrect") {
        shiftReviews();
        sendShowVideoOverlayMessage(reviews.value[0]);
      } else if (event.data.message === "skipReview") {
        shiftReviews();
        sendShowVideoOverlayMessage(reviews.value[0]);
      } else if (event.data.message === "deletePracticeReview") {
        shiftReviews();
        sendShowVideoOverlayMessage(reviews.value[0]);
        api.delete(`/practice-reviews/${event.data.reviewId}`);
      }
    });
    chrome.runtime.sendMessage(
      chrome.runtime.id,
      { message: "storage.get", key: "user-config" },
      (res) => {
        if (res && res.nativeLanguage === "en") {
          router.push("/settings");
        }
      }
    );
    bus.on("user-logged-in", async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        user.value = userInfo;
        reviews.value = await getReviewsFromRemote();
        sendShowVideoOverlayMessage(reviews.value[0]);
      }
    });
    bus.on("user-logged-out", () => {
      user.value = void 0;
      reviews.value = [];
      videoOverlayIframeLoaded = false;
    });
    onMounted(async () => {
      const userInfo = await getUserInfo(true);
      if (userInfo) {
        user.value = userInfo;
        reviews.value = await getReviewsFromRemote();
        sendShowVideoOverlayMessage(reviews.value[0]);
      }
    });
    function sendShowVideoOverlayMessage(review) {
      function _sendShowVideoOverlayMessage(review2) {
        const overlayIframe = document.querySelector(
          "#pact-video-overlay-container"
        );
        if (!overlayIframe || !overlayIframe.contentWindow || !videoOverlayIframeLoaded) {
          return false;
        }
        overlayIframe.contentWindow.postMessage(
          {
            message: "showVideoOverlay",
            subtitle: toRaw(review2),
            extensionId: chrome.runtime.id,
            isReviewing: true
          },
          "*"
        );
        return true;
      }
      const checkVideoOverlayIframeLoadedInterval = setInterval(() => {
        if (_sendShowVideoOverlayMessage(review)) {
          clearInterval(checkVideoOverlayIframeLoadedInterval);
        }
      }, 100);
    }
    return (_ctx, _cache) => {
      const _component_sign_in_form = resolveComponent("sign-in-form");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(_component_sign_in_form)
        ]),
        reviews.value && reviews.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createBaseVNode("iframe", {
            id: "practice-review-video-iframe",
            src: createVideoUrl(reviews.value[0].source, reviews.value[0].sourceId, reviews.value[0].start),
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "",
            class: "q-mr-md"
          }, null, 8, _hoisted_4),
          createBaseVNode("iframe", {
            src: unref(videoOverlayUrl),
            id: "pact-video-overlay-container"
          }, null, 8, _hoisted_5)
        ])) : createCommentVNode("", true),
        reviews.value && reviews.value.length > 0 ? (openBlock(), createElementBlock("span", _hoisted_6, " Due to technical limitations, you have to control the play of the video by hand. ")) : createCommentVNode("", true),
        createVNode(QSeparator, { class: "q-my-lg" }),
        createVNode(AuthorRecommendation)
      ]);
    };
  }
});
var PracticeReview = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-469dc57b"]]);
export { PracticeReview as default };
