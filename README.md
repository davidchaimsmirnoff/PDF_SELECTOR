Besiata DeShmaya בְּסִיַּעְתָּא דִּשְׁמַיָּא,

## **Abstract**
![Alt text](images/PDF_EDITOR.png)


![Alt text](images/Selector_Listening.png)

**This project is a PDF text selection tool that takes advantage of browser-based PDF viewers to extract, edit, and manipulate text. Modern web browsers can recognize ASCII text and even roughly pick up specialized scripts like Rashi script in PDFs. This application builds on that capability, allowing users to select text, automatically insert it into an interactive HTML editor, and make quick modifications.**

**Additionally, the extracted text can be seamlessly transferred into translation models or LLMs such as ChatGPT, Claude, or Perplexity AI for interlinear translation or further processing. This tool is particularly valuable for researchers, students, and professionals working with historical manuscripts or multilingual texts.**

![Alt text](images/Middle.png)

<details>
  <summary><strong> Getting to Know This Project 🔍 </strong></summary>

From what it seems, most PDF viewers have an ability to pick up ASCII text from PDF Documents. It seems even most can pick up the famous and illustrious **Rashi script** from PDFs as well, as shown in the picture below.

![Alt text](images/ref1.jpeg)

Select any of the words from the PDF document, and you will see the text registered in the selection space, as shown in the picture above.

Now, this application allows you, once you have selected the text, to press **Enter** on any selection, and it will automatically add the word into an **interactive HTML editor**, as seen in the image below.

![Alt text](images/EditMode.png)

**Summary**

Overall this allows for **easy editing** and is great for **rendering old manuscripts into selectable form**. (Meaning, in order to copy or paste the text later if needed, or to send the overall text into any **translation model or LLM** like ChatGPT, Claude, or Perplexity AI that supports interlinear translation.) 

This is a very useful application because it allows for **quick text modifications** using the program and saves the output into a **persistent file on the system**.

</details>


<details>
  <summary><strong>Compatibility</strong></summary>

### Browsers That Pick Up PDF Text Streams on Selecting Text:
- **Chrome**  
- **Brave**  
- **Microsoft Edge**  

### Browsers That the PDF Selector Will Accept:
- **Chrome**  
- **Brave**  
- **Microsoft Edge** (Text is reversed, though)  

### Recommended for Use:
- **Chrome**  
- **Brave**  
</details>



<details> 
   <summary><strong>Prerequisites and Requirements 🛠️ </strong></summary>

**To use this tool, make sure you have the following installed:**

✅ **A Browser with PDF Viewing Capabilities** – The program should recognize any browser-based PDF viewer.  
   **Recommended:** [Google Chrome](https://www.google.com/chrome/) or [Brave Browser](https://brave.com/download/)) for best compatibility.  

✅ **Node.js** – Required for running the backend.  
   📥 [Download Node.js](https://nodejs.org/)  

✅ **Python** – Required for additional processing.  
   📥 [Download Python](https://www.python.org/)  

✅ **A PDF Document** – A PDF file containing selectable text to test the application's functionality.

</details>

<details>
 <summary><strong>User Guide - Instructions & Getting Started 🚀 </strong></summary>

**Tutorial** 

**To run the program, clone the repository and start the local server using:**

`node server.js`

**The output should look something like this.**

![Alt text](images/runServerDot_JS.png)

**Once you have run the command go to your webbrowser (Perferably Chrome or Brave) and write localhost:3000 this should load the editor as in the picture below..**

![Alt text](images/WriteLocalHostonWeb.png) 

**Holding down shift and pressing Enter will toggle the editor in Edit Mode where you can copy, paste, write, and delete the text inside the editor.**

![Alt text](images/EditMode.png) 


**Holding shift and pressing enter again will toggle the editor into preview mode where it is easy to view the over all text**

![Alt text](images/SaveMode.png) 









</details>

