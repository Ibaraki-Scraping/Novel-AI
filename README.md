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
| ❌ | `DELETE` | `/user/objects/stories/{id}` |
| ❌ | `PATCH` | `/user/objects/stories/{id}` |
| ✅ | `GET` | `/user/objects/storycontent` |
| ✅ | `GET` | `/user/objects/storycontent/{id}` |
| ❌ | `PUT` | `/user/objects/storycontent` |
| ❌ | `DELETE` | `/user/objects/storycontent/{id}` |
| ❌ | `PATCH` | `/user/objects/storycontent/{id}` |
| ❌ | `GET` | `/user/objects/presets` |
| ❌ | `GET` | `/user/objects/presets/{id}` |
| ❌ | `PUT` | `/user/objects/presets` |
| ❌ | `DELETE` | `/user/objects/presets/{id}` |
| ❌ | `PATCH` | `/user/objects/presets/{id}` |
| ❌ | `GET` | `/user/objects/aimodules` |
| ❌ | `GET` | `/user/objects/aimodules/{id}` |
| ❌ | `PUT` | `/user/objects/aimodules` |
| ❌ | `DELETE` | `/user/objects/aimodules/{id}` |
| ❌ | `PATCH` | `/user/objects/aimodules/{id}` |
| ❌ | `GET` | `/user/objects/shelf` |
| ❌ | `GET` | `/user/objects/shelf/{id}` |
| ❌ | `PUT` | `/user/objects/shelf` |
| ❌ | `DELETE` | `/user/objects/shelf/{id}` |
| ❌ | `PATCH` | `/user/objects/shelf/{id}` |

#### AI
| Done | Method | Endpoint |
| --- | --- | --- |
| ✅ | `POST` | `/ai/generate` |
| ✅ | `POST` | `/ai/generate-prompt` (useless for now) |
| ❌ | `POST` | `/ai/generate-stream` |
| ✅ | `POST` | `/ai/generate-image` |
| ❌ | `POST` | `/ai/annotate-image` |
| ✅ | `POST` | `/ai/upscale` |
| ❌ | `POST` | `/ai/classify` |
| ✅ | `GET` | `/ai/generate-image/suggest-tags` |
| ✅ | `GET` | `/ai/generate-voice` |

#### AI Modules
| Done | Method | Endpoint |
| --- | --- | --- |
| ❌ | `GET` | `/ai/module/all` |
| ❌ | `GET` | `/ai/module/{id}` |
| ❌ | `POST` | `/ai/module/train` |
| ❌ | `POST` | `/ai/module/buy-training-steps` |
| ❌ | `DELETE` | `/ai/module/{id}` |

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
| ❌ | `decrypt ai module` |
| ❌ | `encrypt ai module` |
| ❌ | `decrypt shelf` |
| ❌ | `encrypt shelf` |
| ✅ | `tokenizer encode` |
| ✅ | `tokenizer decode` |
-------------------

NovelAI API documentation : https://api.novelai.net/docs/   
NovelAI SDK documentation : (coming soon)