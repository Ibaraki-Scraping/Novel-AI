# Novel AI
Use novel AI on a program !

## Getting started
`npm i @ibaraki-douji/novelai --save`

## This SDK is still in development, so it's not recommended to use it in production.

### API Endpoints
#### User
| Done | Method | Endpoint |
| --- | --- | --- |
| ✅ | `POST` | `/user/login` |
| ✅ | `GET` | `/user/information` |
| ✅ | `GET` | `/user/data` |
| ✅ | `GET` | `/user/priority` |
| ✅ | `GET` | `/user/giftkeys` |
| ✅ | `GET` | `/user/subscription` |
| ✅ | `GET` | `/user/keystore` |
| ❌ | `PUT` | `/user/keystore` |
| ✅ | `GET` | `/user/clientsettings` |
| ✅ | `PUT` | `/user/clientsettings` |

#### Objects
| Done | Method | Endpoint |
| --- | --- | --- |
| ✅ | `GET` | `/user/objects/stories` |
| ✅ | `GET` | `/user/objects/stories/{id}` |
| ❌ | `PUT` | `/user/objects/stories` |
| ✅ | `DELETE` | `/user/objects/stories/{id}` |
| ❌ | `PATCH` | `/user/objects/stories/{id}` |
| ✅ | `GET` | `/user/objects/storycontent` |
| ✅ | `GET` | `/user/objects/storycontent/{id}` |
| ❌ | `PUT` | `/user/objects/storycontent` |
| ✅ | `DELETE` | `/user/objects/storycontent/{id}` |
| ❌ | `PATCH` | `/user/objects/storycontent/{id}` |
| ❌ | `GET` | `/user/objects/presets` |
| ❌ | `GET` | `/user/objects/presets/{id}` |
| ❌ | `PUT` | `/user/objects/presets` |
| ❌ | `DELETE` | `/user/objects/presets/{id}` |
| ❌ | `PATCH` | `/user/objects/presets/{id}` |
| ✅ | `GET` | `/user/objects/aimodules` |
| ✅ | `GET` | `/user/objects/aimodules/{id}` |
| ❌ | `PUT` | `/user/objects/aimodules` |
| ✅ | `DELETE` | `/user/objects/aimodules/{id}` |
| ❌ | `PATCH` | `/user/objects/aimodules/{id}` |
| ✅ | `GET` | `/user/objects/shelf` |
| ✅ | `GET` | `/user/objects/shelf/{id}` |
| ✅ | `PUT` | `/user/objects/shelf` |
| ✅ | `DELETE` | `/user/objects/shelf/{id}` |
| ✅ | `PATCH` | `/user/objects/shelf/{id}` |

#### AI (Done)
| Done | Method | Endpoint |
| --- | --- | --- |
| ✅ | `POST` | `/ai/generate` |
| ✅ | `POST` | `/ai/generate-prompt` (useless for now) |
| ✅ | `POST` | `/ai/generate-stream` |
| ✅ | `POST` | `/ai/generate-image` action: `generate` |
| ✅ | `POST` | `/ai/generate-image` action: `img2img` |
| ✅ | `POST` | `/ai/generate-image` action: `infill` |
| ✅ | `POST` | `/ai/annotate-image` |
| ✅ | `POST` | `/ai/upscale` |
| ❌ | `POST` | `/ai/classify` (reserved to admins) |
| ✅ | `GET` | `/ai/generate-image/suggest-tags` |
| ✅ | `GET` | `/ai/generate-voice` |

#### AI Modules
| Done | Method | Endpoint |
| --- | --- | --- |
| ✅ | `GET` | `/ai/module/all` |
| ✅ | `GET` | `/ai/module/{id}` |
| ✅ | `POST` | `/ai/module/train` |
| ✅ | `DELETE` | `/ai/module/{id}` |

### Additional functions
| Done | Function |
| --- | --- |
| ✅ | `create login key` |
| ✅ | `create decrypt key` |
| ✅ | `decrypt keystore` |
| ❌ | `encrypt keystore` |
| ✅ | `decrypt story` |
| ❌ | `encrypt story` |
| ✅ | `decrypt story content` |
| ❌ | `encrypt story content` |
| ❌ | `decrypt preset` |
| ❌ | `encrypt preset` |
| ✅ | `decrypt ai module` |
| ❌ | `encrypt ai module` |
| ✅ | `tokenizer encode` |
| ✅ | `tokenizer decode` |
-------------------

NovelAI API documentation : https://api.novelai.net/docs/   
NovelAI SDK documentation : (coming soon)

-------------------

### Example
```js

const NovelAI = require('@ibaraki-douji/novelai').default;

const nai = new NovelAI();

nai.user.login('email', 'password').then(async () => {
    const stories = await nai.stories.get();
    console.log(stories);
});

```

-------------------

### Functions
- `nai.user.login(email, password)`
- `nai.user.getSubscription()`
- `nai.user.getInformation()`
- `nai.user.getData()`
- `nai.user.getPriority()`
- `nai.user.getGiftKeys()`
- `nai.user.getUserInfos()`
- `nai.user.getSettings()`
- `nai.user.editSettings(settings)`
-
- `nai.stories.get()`
- `nai.stories.get(id)`
- `nai.stories.delete(id)`
- `nai.stories.getContent()`
- `nai.stories.getContent(id)`
- `nai.stories.deleteContent(id)`
- `nai.stories.generatePrompt(options)`
- `nai.stories.generate(options)`
- `nai.stories.generateStream(options)`
-
- `nai.shelves.get()`
- `nai.shelves.get(id)`
- `nai.shelves.create(options)`
- `nai.shelves.update(id, options)`
- `nai.shelves.delete(id)`
-
- `nai.modules.get()`
- `nai.modules.get(id)`
- `nai.modules.delete(options)`
- `nai.modules.train(options)`
- `nai.modules.getTrained()`
- `nai.modules.getTrained(id)`
- `nai.modules.deleteTrained(id)`
-
- `nai.images.generate(options)`
- `nai.images.enhance(options)`
- `nai.images.getMask(options)`
- `nai.images.generateVariations(options)`
- `nai.images.generateInFill(options)`
- `nai.images.getSuggestedTags(options)`
- `nai.images.upscale(options)`
-
- `nai.tts.generate(options)`