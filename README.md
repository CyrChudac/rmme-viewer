# STATSVIEW  
Statsview is a software for NGS data visualization. This file should answer most questions you may have regarding practical usage and the programming aspect of the software.

## How to run it?  
Download the zip file and extract it. Or you can run the 

    git init
    git pull https://github.com/CyrChudac/statsview
commands instead. 

Also go to https://nodejs.org/en/download/ address to download and install Node.js. Follow their instructions.
Then open your command line and navigate to the statsview folder.
Run command

    npm run dev
    
The application should now be available for you on http://localhost:8067/ address.

Currently, the build script does not work, otherwise you could run the

    npm run build

command and obtain a html file, that would no longer require running the server when opening the application.

## Files structure
In the application there are 3 main type of files: .js, .vue, .scss.
There are a few others such as .json, .html or .css, but I am not going to go in depth to describe you how to handle them,
sinc there are not many of them and you are probably not going to encounter them.  

Js files mostly contain plain code in form of functions that may be called from other js and vue files. If they use any external code, they almost exclusively have it at 
the very begining of the file after the "import" keyword. The code that is visible to the other files after importing it must be marked as export. 
Js coding syntax is not hard at all. I came to the project not knowing anything about js, and I was familiar with the syntax in just a few weeks.  

Vue files are the main files of the whole project. They describe the layout of the page. 
Their syntax is kindof diffeerent and not that intuitive as in js, but once you get familiar with them, they become 
really nice to navigate through and they create really good element structure. 
Vue files start with template section, that describes the components of the element similarly to html. 
The following part is the script part, that by convention starts with the imports (again import keyword) and then for 
most files there is just one export default - that is the code of the template, that you are going to use from other files. 
This code can be referenced from the template using the ":" syntax. Example:  

    <template>
      <row
        :param="rowParam"
      />
    </template>
    <script>
      import row-template from "./row-template.vue";
      export default{
        "name": "row-container",
        "components": {
          "row": row-template,
        },
        "computed": {
          "rowParam": function() {
          
            //code to compute the param
            
            return xy;
          }
        }
      }
    </script>

With the ":" syntax, you can place any code into the quotes and it will be computed, without the ":" syntax, you can only place constants there. 
The script may also have some other functions, that are not in the export default section, however these cannot work with the element state. 
The last part is the style scoped part. Here you can define styles that you can use in the template. You can also use any styles defined in the imported files.
Example:

    <template>
      <span class="colored">Hello,</span>
      <span style="background-color: red;">world!</span>
    </template>
    <style scoped>
      .colored {
        background-color: blue;
      }
    </style>
    
So you can see that we have two main possibilities to define the style of on object - 
in the style property and with the class property using the name defined in the style scoped section.

Here it is where the third type of files comes in, these are scss files. In our project, you can find them only in the styles folder. 
These are files defining styles pretty much the same way as style scoped does in vue files. 
However they have some support fort nesting and variables, which makes them much more friendly for coding. 
They support  loops, so you can make multiple different styles just by iterating through a loop. 
They have @mixin which lets you create a style given parameters. 
And they have functions so that you can set values as the return value of a given function.
If you want to see those, look in the [/styles/_list-group.scss](./styles/_list-group.scss) file. All of those are used there (scroll to the end).
    

## Overall folder structure  
1. build      configuration files that describes how is the whole software build  
2. client     files of the actual visual layout and logic of the layout  
2.1 d3js      files describing the graphs  
2.2 ui        files describing all containers other than the graph container (files list, views list, examples dropdown...)  
2.3 views     actual templates for the views, selecting which graph type to use and how to process the data  
3. public     head of the program - you tipicaly do not need to change anything here  
4. server     files describing the properties of the server  
5. styles     files describing styles of elements all over the application, that are not element specific  
  5.1 themes    files describing color themes  

## Client folders in depth  
If you plan to change anything in the app, you are probably going to do so here. Most things regarding algorithms and visual layout are here. 
Also styles, that are element specific such as rotated text of y axes caption or the border frame when an example is active and so, are located here.  

The main file is the application.vue file, it's the root file of the layouts. If you want anything to be shown, you need it to be nested under this one.
Here we have the navigation bar on the top with all of it's elements, followed by file list, 
view list, the 2 buttons that can make those lists disappear and finally the view columm.  

If you want to change anything in the navigation bar, you are going to do it directly in the application vue file.
The only exception are the dropdowns, that are reactive and have their's own templates in the ui folder - example-text-list and left-view-menu.  

File list is also located in the ui folder, the actual files array is in the application.vue file and is passed as an argument.  

Views list is again located in the ui folder. The actual views arraay is also passed as argument from the application, 
however it's imported from the view-list-definition file into the application.vue and then processed and passed as an argument.  

The two buttons are also in ui folder in file named left-view-menu.  

And finally the main graph plane is in the view-column file. Here all the posible view are listed. Each has it's own template and logic implemented in the views folder. 
All of the graph views also use some of the graphs defined by files in the d3js folder. 
