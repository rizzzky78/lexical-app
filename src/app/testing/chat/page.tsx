"use client";
import { ChatMessages } from "@/components/kratos/chat-messages";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { mapUIState } from "@/lib/agents/action/map-ui-state";
import { MessageProperty } from "@/lib/types/ai";
import { CircleArrowUp, ImageIcon, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function PrototypeChatPanel() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        500
      )}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="">
      <div className="fixed -bottom-3 right-0 left-0 mx-auto flex flex-col items-center justify-end">
        <div className="w-full max-w-2xl flex flex-col bg-background pb-5 rounded-t-3xl">
          <form className="relative w-full rounded-3xl bg-muted flex flex-col px-2 p-2 h-full">
            <ScrollArea className="w-full pr-3 min-h-[40px] max-h-[500px] overflow-x-auto">
              <Textarea
                ref={textareaRef}
                name="text_input"
                placeholder="Type your message here..."
                spellCheck={false}
                value={input}
                onChange={handleInputChange}
                className="resize-none w-full border-none focus:border-none hover:border-none text-sm overflow-hidden"
              />
            </ScrollArea>
            <div className="flex justify-between p-1">
              <div className="flex items-center *:hover:bg-transparent *:bg-transparent">
                <Button
                  size={"icon"}
                  className="text-[#4A4947] dark:text-white rounded-full"
                >
                  <Paperclip className="h-6 w-6 -rotate-45" />
                </Button>
                <Button
                  size={"icon"}
                  className="text-[#4A4947] dark:text-white rounded-full"
                >
                  <ImageIcon className="h-6 w-6" />
                </Button>
              </div>
              <div className="text-[#4A4947] dark:text-white *:hover:bg-transparent *:bg-transparent">
                <Button
                  size={"icon"}
                  className="text-[#4A4947] dark:text-white rounded-full"
                >
                  <CircleArrowUp className="h-6 w-6 hover:text-gray-300" />
                </Button>
              </div>
            </div>
          </form>
          <div className="pt-2 text-xs flex justify-center">
            <h3 className="text-gray-200">
              This app can make mistakes, use with concern.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

const chatData: MessageProperty[] = [
  {
    id: "l93Q9jwyeolXJUfX",
    role: "user",
    content: "search for intel arc",
  },
  {
    id: "xEZdyN83RM0gNaiw",
    role: "assistant",
    content: [
      {
        type: "tool-call",
        toolCallId: "NpVqBLrEcTBhfDsj",
        toolName: "searchProduct",
        args: {
          query: "intel arc",
        },
      },
    ],
  },
  {
    id: "P2O9sFELSM5r7sj4",
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: "NpVqBLrEcTBhfDsj",
        toolName: "searchProduct",
        result:
          '{"success":true,"name":"searchProduct","args":{"query":"intel arc"},"data":{"data":[{"title":"ASRock Intel Arc A750 Challenger D 8GB OC 256Bit DDR6","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/11/30/60ac1da6-55af-4a22-9ffe-72afefa6894a.jpg.webp?ect=4g","price":"Rp3.860.000","rating":"4.7","sold":"3 terjual","link":"https://www.tokopedia.com/starseventeen/asrock-intel-arc-a750-challenger-d-8gb-oc-256bit-ddr6?extParam=ivf%3Dfalse%26keyword%3Dintel+arc&src=topads","store":{"name":"STAR SEVENTEEN","location":"Jakarta Selatan","isOfficial":false}},{"title":"Lenovo Yoga Slim 7 OLED Touch Intel Ultra 5 125H 16GB 512GB SSD Windows 11 OHS 14 Inch WUXGA Arc 14IMH9 05ID","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/9/0539ddfb-ffbf-45be-8876-27b85785ff64.png.webp?ect=4g","price":"Rp14.799.000","rating":"5.0","sold":"13 terjual","link":"https://www.tokopedia.com/thinkpadofficial/lenovo-yoga-slim-7-oled-touch-intel-ultra-5-125h-16gb-512gb-ssd-windows-11-ohs-14-inch-wuxga-arc-14imh9-05id-windows-11-home-normal-bundling-90496?extParam=ivf%3Dtrue%26keyword%3Dintel+arc%26search_id%3D202412300424051A869164C8B3440174P2%26src%3Dsearch","store":{"name":"Thinkpad Official Store","location":"Jakarta Utara","isOfficial":true}},{"title":"MSI Claw A1M Intel Ultra 7-155H Intel Arc 16GB 7\\" FHD 120Hz IPS Level","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/2/28/6610c208-44bb-4b9c-b68d-8b1424ab797c.jpg.webp?ect=4g","price":"Rp7.599.000","rating":"5.0","sold":"60+ terjual","link":"https://www.tokopedia.com/msi-official/msi-claw-a1m-intel-ultra-7-155h-intel-arc-16gb-7-fhd-120hz-ips-level-512gb-0d900?extParam=ivf%3Dtrue%26keyword%3Dintel+arc%26search_id%3D202412300424051A869164C8B3440174P2%26src%3Dsearch","store":{"name":"MSI Official Store","location":"Jakarta Pusat","isOfficial":true}},{"title":"Asus Zenbook 14X OLED Touch UX3405M Ultra 7 155H 32GB Intel Arc 120Hz","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/16/90601382-41cb-421a-8f62-690a53aec268.jpg.webp?ect=4g","price":"Rp18.259.000","rating":"5.0","sold":"16 terjual","link":"https://www.tokopedia.com/notebookgamingid/asus-zenbook-14x-oled-touch-ux3405m-ultra-7-155h-32gb-intel-arc-120hz-non-anti-gores-ultra-7-blue-82380?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D202412300424051A869164C8B3440174P2%26src%3Dsearch","store":{"name":"NOTEBOOK GAMING ID","location":"Jakarta Pusat","isOfficial":true}},{"title":"Lenovo IdeaPad Slim 5 Intel Core Ultra 5 125H Arc 16GB 512GB SSD 14\\" OLED","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/5/31/b735c717-963c-4305-b432-4ff76fd6e1e6.png.webp?ect=4g","price":"Rp11.599.000","rating":"5.0","sold":"100+ terjual","link":"https://www.tokopedia.com/distrilapid/lenovo-ideapad-slim-5-intel-core-ultra-5-125h-arc-16gb-512gb-ssd-14-oled-abyss-blue-non-bundle-3b352?extParam=ivf%3Dtrue%26keyword%3Dintel+arc%26search_id%3D202412300424051A869164C8B3440174P2%26src%3Dsearch","store":{"name":"Distributor Laptop ID","location":"Jakarta Pusat","isOfficial":true}},{"title":"MSI Claw A1M Intel Ultra 7-155H 16GB 7.0\\" FHD IPS 120Hz Intel Arc W11","image":"https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/1/13/f7357c6a-387e-4f3d-bcd2-6b1f075de6e5.jpg.webp?ect=4g","price":"Rp7.599.000","rating":"5.0","sold":"30+ terjual","link":"https://www.tokopedia.com/collinsofficial/msi-claw-a1m-intel-ultra-7-155h-16gb-7-0-fhd-ips-120hz-intel-arc-w11-ssd-512gb-e9ebc?extParam=ivf%3Dfalse%26keyword%3Dintel+arc%26search_id%3D202412300424051A869164C8B3440174P2%26src%3Dsearch","store":{"name":"Collins Official","location":"Jakarta Pusat","isOfficial":true}}]}}',
      },
    ],
  },
  {
    id: "SIHGx7S8yVYYY1Jh",
    role: "assistant",
    content:
      "# Key Points\n- **ASRock Intel Arc A750**: A budget-friendly graphics card with 8GB VRAM, suitable for gaming and content creation at a lower cost.\n- **Lenovo Yoga Slim 7**: A premium laptop with an OLED touch screen, offering high-end performance for professionals and creatives.\n- **MSI Claw A1M**: A gaming handheld device with a high refresh rate screen, ideal for gamers on the go.\n- **Asus Zenbook 14X**: A top-tier laptop with a 120Hz OLED touch screen, perfect for those needing the best display quality and performance.\n- **Lenovo IdeaPad Slim 5**: A versatile laptop with an OLED screen, good for both work and entertainment, at a more accessible price point.\n\n# Value Considerations\n- **ASRock Intel Arc A750**: Offers good value for budget-conscious gamers or creators looking for a dedicated GPU without breaking the bank.\n- **Lenovo Yoga Slim 7**: Priced higher but provides a premium experience with its OLED screen and powerful internals, justifying the cost for those who need top-tier performance.\n- **MSI Claw A1M**: A specialized device for gaming, its price reflects its niche market, offering a unique portable gaming experience.\n- **Asus Zenbook 14X**: The highest price point, but it's packed with features like a high refresh rate OLED screen and substantial RAM, making it a luxury choice.\n- **Lenovo IdeaPad Slim 5**: Balances performance and price, offering OLED screen quality at a more reasonable cost compared to the Yoga Slim 7.\n\n# Recommendations\n- **For Budget Gamers or Creators**: The **ASRock Intel Arc A750** is your best bet. It provides decent performance for its price, especially if you're looking to upgrade your PC without spending too much.\n  \n- **For Professionals and Creatives**: If you need a laptop for high-end work, the **Lenovo Yoga Slim 7** or **Asus Zenbook 14X** are excellent choices. The Yoga Slim 7 offers a balance of performance and portability, while the Zenbook provides the best screen quality and performance for those who can afford it.\n\n- **For Gamers on the Go**: The **MSI Claw A1M** is the go-to device. Its high refresh rate screen and powerful internals make it ideal for gaming anywhere.\n\n- **For General Use with a Premium Touch**: The **Lenovo IdeaPad Slim 5** is a great middle ground. It offers an OLED screen for better visuals at a price that's not as steep as the Yoga Slim 7 or Zenbook.\n\n- **Considerations**: \n  - **Seller Reputation**: All products are from reputable sellers, with official stores offering additional peace of mind.\n  - **Performance and Reliability**: Higher-priced models generally offer better performance and reliability, but the ASRock card is a reliable choice for its price range.\n  - **Potential Concerns**: Ensure compatibility with your existing hardware for the ASRock card, and consider the need for a high refresh rate screen if opting for the MSI Claw A1M.",
  },
];

function PrototypeChatMessages() {
  const uiState = mapUIState({ chatId: "badsjhjsahg8", messages: chatData });

  return (
    <div className="pb-10">
      <ChatMessages ui={uiState} />
    </div>
  )
}

export default function Container() {
  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-2">
      <PrototypeChatMessages />
      <PrototypeChatPanel />
    </div>
  );
}
