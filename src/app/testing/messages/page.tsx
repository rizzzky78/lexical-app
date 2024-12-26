import { ChatMessages } from "@/components/kratos/chat-messages";
import { SectionMessage } from "@/components/kratos/section-message";

interface ChatMessage {
  role: "assistant" | "user" | "tool";
  content:
    | string
    | Array<{
        type: string;
        text?: string;
        toolCallId?: string;
        toolName?: string;
        args?: {
          args: string;
        };
        result?: string;
      }>;
}

interface ChatData {
  chatId: string;
  messages: ChatMessage[];
}

export const ChatContainer = ({ chatData }: { chatData: ChatData }) => {
  return (
    <div className="px-4 sm:px-6 md:px-8 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      {chatData.messages.map((message, index) => (
        <SectionMessage
          key={index}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  );
};

const chatData: ChatData = {
  chatId: "gswc7DvyUaEmuzvX",
  messages: [
    {
      role: "user",
      content: "search for intel arc",
    },
    {
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId: "Fz2fDk2usXpIAApJ",
          toolName: "searchProduct",
          args: {
            args: "intel arc",
          },
        },
      ],
    },
    {
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "Fz2fDk2usXpIAApJ",
          toolName: "searchProduct",
          result:
            '{"data":[{"title":"Intel ARC A750 Limited Edition VGA 8GB GDDR6 Graphic Card Gaming","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/7/6/e1192b48-01dc-43f2-a766-8efa3cb8b29b.png.webp?ect=4g","price":"Rp4.097.380","rating":"5.0","sold":"15 terjual","link":"https://www.tokopedia.com/gimugimu/intel-arc-a750-limited-edition-vga-8gb-gddr6-graphic-card-gaming?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"Gimu Gimu Store","location":"Jakarta Utara","isOfficial":true}},{"title":"ASROCK Intel ARC A380 6GB GDDR6 LP - Low Profile","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/9/14/24d8837b-17fa-4679-9fa4-58eb15a7531a.jpg.webp?ect=4g","price":"Rp1.995.000","rating":"5.0","sold":"60+","link":"https://www.tokopedia.com/tokoexpert/asrock-intel-arc-a380-6gb-gddr6-lp-low-profile?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"toko expert komputer","location":"Jakarta Pusat","isOfficial":true}},{"title":"GIGABYTE Intel ARC A380 Windforce 6GB GDDR6","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/5/2/cf4c1ead-45f0-48f1-98f0-1dd162575be7.jpg.webp?ect=4g","price":"Rp2.085.000","rating":"5.0","sold":"60+","link":"https://www.tokopedia.com/tokoexpert/gigabyte-intel-arc-a380-windforce-6gb-gddr6?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"toko expert komputer","location":"Jakarta Pusat","isOfficial":true}},{"title":"ASROCK INTEL ARC A580 CHALLENGER OC 8GB GDDR6","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/11/10/eac425b9-8bc5-487e-bdd5-a6d69a258f71.jpg.webp?ect=4g","price":"Rp2.990.000","rating":"4.9","sold":"7 terjual","link":"https://www.tokopedia.com/tokoexpert/asrock-intel-arc-a580-challenger-oc-8gb-gddr6?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"toko expert komputer","location":"Jakarta Pusat","isOfficial":true}},{"title":"ASROCK Intel ARC A380 CHALLENGER ITX 6GB OC GDDR6","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/11/29/cbc5f511-30c1-45fd-b05d-b1b75594f612.jpg.webp?ect=4g","price":"Rp1.990.000","rating":"4.8","sold":"30+","link":"https://www.tokopedia.com/tokoexpert/asrock-intel-arc-a380-challenger-itx-6gb-oc-gddr6?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"toko expert komputer","location":"Jakarta Pusat","isOfficial":true}},{"title":"ASROCK Intel ARC A770 PHANTOM GAMING OC 16GB GDDR6 - A770 PG 16GB OC","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/12/5/7447079f-0443-4c73-a2ba-c85f742e47cd.jpg.webp?ect=4g","price":"Rp6.020.000","rating":"5.0","sold":"10 terjual","link":"https://www.tokopedia.com/tokoexpert/asrock-intel-arc-a770-phantom-gaming-oc-16gb-gddr6-a770-pg-16gb-oc?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D20241225131311A0539D7EA1E90932DTS0%26src%3Dsearch","store":{"name":"toko expert komputer","location":"Jakarta Pusat","isOfficial":true}}]}',
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "# Key Points\n- **Intel ARC A750 Limited Edition**: Offers 8GB GDDR6 memory, suitable for high-end gaming with a price of Rp4,097,380. It's a good choice for those looking for performance without breaking the bank.\n- **ASROCK Intel ARC A380**: Available in different configurations, with prices ranging from Rp1,990,000 to Rp2,085,000. These are budget-friendly options for entry-level gaming or general use.\n- **ASROCK Intel ARC A580**: Priced at Rp2,990,000, it provides a middle ground with 8GB GDDR6, offering better performance than the A380 models.\n- **ASROCK Intel ARC A770**: The top-tier option with 16GB GDDR6, priced at Rp6,020,000, ideal for enthusiasts and those needing maximum performance.\n\n# Value Considerations\n- **A750 Limited Edition**: At Rp4,097,380, it provides a strong balance between cost and performance, making it a value pick for gamers looking for a step up from entry-level cards.\n- **A380 Series**: These cards offer good value for budget-conscious buyers, with prices under Rp2,100,000. They are suitable for light gaming or as an upgrade for older systems.\n- **A580**: For around Rp3,000,000, you get a significant performance boost over the A380 models, making it a smart choice for those wanting more power without the high cost of the A770.\n- **A770**: While expensive at Rp6,020,000, it's the best choice for those who need top-tier performance, especially for 4K gaming or professional applications.\n\n# Recommendations\n- **For Budget Buyers**: The ASROCK Intel ARC A380 models are your best bet. They offer decent performance for casual gaming or general computing tasks at a very reasonable price.\n- **For Mid-Range Gamers**: The ASROCK Intel ARC A580 provides a good mix of performance and price. It's suitable for gamers who want to play at higher settings without spending too much.\n- **For High-End Gamers**: If you're looking for the best performance and can afford it, the ASROCK Intel ARC A770 with 16GB GDDR6 is the way to go. It's perfect for 4K gaming, VR, and other demanding applications.\n- **For Compact Builds**: The ASROCK Intel ARC A380 LP (Low Profile) is ideal for small form factor PCs or HTPCs where space is at a premium.\n\nRemember, all these cards come from reputable sellers with high ratings, ensuring good service and reliability. Consider your specific needs, budget, and the size of your PC case when making your choice.",
        },
      ],
    },
    {
      role: "user",
      content: "this is example",
    },
    {
      role: "assistant",
      content: "I am sorry, I cannot access external links.\n",
    },
    {
      role: "user",
      content:
        "Intel Arc A770 ray tracing performance analysis and comparisons",
    },
    {
      role: "assistant",
      content:
        "I am sorry, I cannot fulfill that request. I lack the ability to browse the internet and gather the information.\n",
    },
  ],
};

export default function Page() {
  return <ChatMessages chatId={chatData.chatId} messages={chatData.messages} />;
}
