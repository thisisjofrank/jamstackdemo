import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {

    console.log("Oh hai! 🖤");

    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const chatText = document.getElementById("chatText");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;

    form.addEventListener("submit", (e:SubmitEvent) => {
        e.preventDefault();

        channel.publish({ name: "chat-message", data: input.value });
        input.value = "";
        input.focus();
    })

    await channel.subscribe((msg: Types.Message) => {
        console.log("Ably message received", msg);

        const author = msg.connectionId === ably.connection.id ? "me" : "other";
        var messageElement = document.createElement("span");
        messageElement.classList.add("message");
        messageElement.setAttribute("data-author", author);
        messageElement.innerHTML = msg.data;

        chatText.appendChild(messageElement);
    });

})();

