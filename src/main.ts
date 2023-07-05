import { NovelAI } from ".";

(async () => {

    const novelai = new NovelAI();

    await novelai.user.login("", "");

    console.log(await novelai.stories.get());

})()