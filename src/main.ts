import { NovelAI } from ".";

(async () => {

    const novelai = new NovelAI();

    await novelai.user.login("lubos.kolen@gmail.com", "A7k4mqq5wu");

    console.log((await novelai.stories.getContent()).map(e => novelai.stories.deleteContent(e.id)));

})()