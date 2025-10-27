/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

export const getAnalysisFromVideoPrompt = (language: string): string => `You are an expert scriptwriter and story analyst. Analyze the attached video and provide a detailed breakdown of its content, focusing on the structure and planning of the material. Follow the structure below to describe the composition and elements of the content, observing how the script and production choices were made.

The entire output should be a single string containing the full breakdown in well-formatted Markdown. Do not wrap the output in a JSON object or any other formatting.

---

**STYLE:**
[General description of the content's style—what is the visual and thematic concept? What are the aesthetic or cultural references? What is the language used (formal, informal, humorous, dramatic, educational)? What is the communication approach, how does it connect with the audience?]

**NARRATIVE STRUCTURE:**
[Analysis of the script's flow and construction—how is the content structured? Is there a clear introduction, development, and conclusion? How are transitions between scenes, topics, or themes handled? Does the content follow a linear, non-linear, or episodic narrative line? What are the main turning points or key moments?]

**CHARACTERS/CHARACTERISTICS:**
[If applicable, analyze the "characters" or main elements of the content. Do not refer to the physical appearance of people, but to their role in the content. What are their functions within the narrative? How are they introduced and developed throughout the video? Is there clear protagonism? What are the relationships between the main elements?]

**THEMES & MESSAGES:**
[What are the main themes or messages of the content? How are they explored throughout the video? Is there a central conflict or a question being addressed? How are the main ideas presented and developed?]

**PACING & RHYTHM:**
[What is the pace of the content? Is the flow constant or are there moments of pause or intense action? How does the rhythm impact the viewer/user experience? How are transitions between scenes or pages made? Is the time dedicated to each segment appropriate for the content's purpose?]

**AUDIENCE ENGAGEMENT:**
[How does the content seek to engage the public? Are there interactive moments, calls to action (CTAs), or resources that encourage active participation? How does the content communicate directly with the audience and try to keep them involved?]

**VISUAL & AESTHETIC CHOICES:**
[What are the visual choices made to complement the script? How are colors, typography, graphics, and images used to support the narrative and theme? Is there any visual symbolism or visual metaphors?]

**TECHNICAL ASPECTS:**
[Analysis of the technical aspects that influence the content, such as the quality of design, animations, editing, and visual effects. What technical resources were used to support the narrative flow? Does the choice of music, sounds, or effects help to strengthen the message? What tools or techniques are evident in the content?]

---

⚙️ **Mandatory Rules:**

* Do not invent information that is not in the original content.
* Focus on technical, narrative, and production choices.
* Use technical vocabulary from screenwriting, content design, and video production.
* The description must be faithful to the content and useful for a deep recreation or analysis of the creative process behind the material.
* Always structure with the ALL CAPS blocks (STYLE, NARRATIVE STRUCTURE, CHARACTERS/CHARACTERISTICS, THEMES & MESSAGES, PACING & RHYTHM, AUDIENCE ENGAGEMENT, VISUAL & AESTHETIC CHOICES, TECHNICAL ASPECTS).

---

**IMPORTANT: The entire final report must be written in ${language}.**
`;