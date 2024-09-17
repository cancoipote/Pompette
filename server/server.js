const port                  = 8018;
const WebSocket             = require('ws');
const wss                   = new WebSocket.Server({ port: port });
var webServer               = {};
var ffi                     = require('ffi-napi')
const sp                    = require('serialport');
const path                  = require('path');
var dmx                     = {};
var isDmxRunning            = false;
const fs                    = require('fs');
const {XMLParser}           = require('fast-xml-parser');
const puppeteer             = require('puppeteer');



/*********
*
* DMX
*
*/

/**
 * Initialisation of DMX
 */
function initDMX()
{
    const dllPath = path.join(__dirname, 'dmx.dll');
    dmx.driver = ffi.Library(dllPath, 
    {
        init: ['void', []],
        setValues: ['void', ['char *']]
    }
    );
    dmx.driver.init();

    dmx.buffer = Buffer.alloc(513)
    for (var i = 0; i <= 512; i++) 
    {
        dmx.buffer[i] = 0
    }

    isDmxRunning = true;

    updateDMX();
}

/**
 * Set DMX Buffer
 */
function setDMXBuffer( datas )
{
    let dmx_tab = datas.split(",")
            
    for( let i = 0; i < dmx_tab.length; i++ )
    {
        dmx.buffer[i] = parseInt(dmx_tab[i]);
    }
    dmx.driver.setValues(dmx.buffer)
}


/**
 * Update DMX Buffer
 */
function updateDMX() 
{
    dmx.driver.setValues(dmx.buffer);

    if( isDmxRunning == true )
    {
        setTimeout(() => {
            updateDMX();
    }, 50);
    }  
}

initDMX();





/*********
*
* Port COM
*
*/

/**
 * List Port(s) COM
 */
function listPortCom( )
{
    sp.SerialPort.list()
    .then((
    data) => 
        {
        console.log(data)
        webServer.send("port#" + JSON.stringify(data));
        }
    )
    .catch(err => console.log(err));
}




/*********
*
* Fixtures
*
*/

/**
 * List Fixtures
 * @param {*} ws
 */
function getFixtures(ws)
{
  console.log("List Fixtures");
  const fixturesPath = path.join(__dirname, './assets/fixtures');
  fs.readdir
  (
    fixturesPath, 
    { 
        withFileTypes: true },
        (err, files) => 
        {
            if (err) 
            {
                ws.send(JSON.stringify({ error: 'Unable to scan directory' }));
                return;
            }

            const result = files.map
            (
                file => 
                {
                    if (file.isDirectory()) 
                    {
                        const directoryPath = path.join(fixturesPath, file.name);
                        const dirFiles = fs.readdirSync(directoryPath).filter(f => f.endsWith('.json')).map(fileName => {
                        const filePath = path.join(directoryPath, fileName);
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        return { label: fileName, content: JSON.parse(fileContent) };
                    }
                );
                return { label: file.name, fixtures: dirFiles };
            }
            else 
            {
                return null;
            }
        }
    )
    .filter(Boolean);  
    ws.send("fixtures#" + JSON.stringify(result));
  });

}

/**
 * Save Ficture
 * @param {*} ws
 * @param {*} data 
 */
function saveFixture( ws, data )
{
    console.log("Save Ficture");

    let fixture = JSON.parse(data);
    let newFilepath = "./assets/fixtures/" + fixture.manufacturer + "/" + fixture.manufacturer + "-" +  fixture.label + ".json";

    if( fixture.filePath)
    {
        if( fixture.filePath != "")
        {
            if( fixture.filePath != newFilepath )
            {
                // Delete old file
                if( fs.existsSync(fixture.filePath) )
                {
                    fs.unlinkSync(fixture.filePath);
                }

                let oldManufacturerPathTab = fixture.filePath.split("/");
                let oldManufacturerPath = "";
                for( let i = 0; i < oldManufacturerPathTab.length - 1; i++ )
                { 
                    oldManufacturerPath += oldManufacturerPathTab[i] + "/";
                }


                if( fs.existsSync(oldManufacturerPath) )
                {
                    //if folder is empty we delete it
                    if( fs.readdirSync(oldManufacturerPath).length == 0 )
                    {
                        fs.rmdirSync(oldManufacturerPath);
                    }
                }
            }
        }
    }
    else
    {
        fixture.filePath = newFilepath;
    }


    let manufacturerPath = "./assets/fixtures/" + fixture.manufacturer;
    // if folder not exist we create it
    if( !fs.existsSync(manufacturerPath) )
    {
        fs.mkdirSync(manufacturerPath);
    }

    // Create new file
    const updatedData = JSON.stringify(fixture, null, 2);

    // Écrire le nouveau contenu dans le fichier JSON
    fs.writeFile(newFilepath, updatedData, 'utf8', err => 
        {
            if (err) 
            {
                console.error('Erreur d\'écriture dans le fichier:', err);
                return;
            }
            console.log('Save Complete');
            getFixtures( ws );
        }
    );
}



/**
 * Delete Ficture
 * @param {*} ws
 * @param {*} data 
 */
function deleteFixture( ws, data )
{
    console.log("Delete Ficture");

    let fixture = JSON.parse(data);

    if( fixture.filePath)
    {
        if( fixture.filePath != "")
        {
            // Delete  file
            if( fs.existsSync(fixture.filePath) )
            {
                fs.unlinkSync(fixture.filePath);
            }

            let manufacturerPathTab = fixture.filePath.split("/");
            let manufacturerPath = "";
            for( let i = 0; i < manufacturerPathTab.length - 1; i++ )
            { 
                manufacturerPath += manufacturerPathTab[i] + "/";
            }

            if( fs.existsSync(manufacturerPath) )
            {
            //if folder is empty we delete it
                if( fs.readdirSync(manufacturerPath).length == 0 )
                {
                    fs.rmdirSync(manufacturerPath);
                }
            }

            console.log('Delete Complete');
            getFixtures( ws );
        }
    }  
}
 

/**
 * Export PDF
* @param {*} ws  
* @param {*} data 
 */
async function exportPDF( ws, data )
{
    try 
    {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        data = data.split("_@_").join("#");
        let jsonData = JSON.parse(data );

        await page.setContent(jsonData.body);
        await page.addStyleTag({ content:jsonData.style });

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
        //ws.send(pdfBuffer);
        ws.send("pdf#" + pdfBuffer.toString('base64'));
    } 
    catch (error) 
    {
        ws.send('Erreur lors de la génération du PDF');
        console.log('Erreur lors de la génération du PDF');
    }
    
}


//
// Server
//
wss.on('connection', (ws) => 
{
    webServer = ws;
    console.log('Client connected');
    webServer.on('message', (message) => 
        {
            // console.log(`Received message => ${message}`);

            let cmd_tab = message.toString().split("#");

            if( cmd_tab.length == 2 )
            {
                switch( cmd_tab[0] )
                {
                    case "dmx":
                        setDMXBuffer( cmd_tab[1] );
                        break;

                    case "port":
                        listPortCom( ws );
                        break;

                    case "fixtureSave":
                        saveFixture( ws, cmd_tab[1] );
                        break;

                    case "fixtureDelete":
                        deleteFixture( ws, cmd_tab[1] );
                        break;

                    case "fixtures":
                        getFixtures( ws );
                        break;

                    case "pdf":
                        exportPDF( ws, cmd_tab[1] );
                        break;

                    default:
                        break;
                }
            }

            webServer.send(`Echo: ${message}`);
        }
    )
    ;
    webServer.on('close', () => {
    console.log('Client disconnected');
    });
    }
);

console.log('WebSocket server is running on ws://localhost:' + port);













/*********
*
* Convert
*
*/

let indexFixture = 0;

function convert()
{
  console.log("Convert");
  let path = "./assets/fixtures/";
    fs.readdir(path, (err, folders) => {
      folders.forEach(folder => {
        convertParseFolder( path, folder);
      });
  });
}

function convertParseFolder( path, folderName)
{
  fs.readdir(path + "/" + folderName, (err, files) => 
  {
    if( files )
    {
      files.forEach(file => {
        
        parseFile( path, folderName, file);
      });
    }
  });
}

function parseFile(path, folderName, file)
{
  console.log(folderName);
  console.log("\t" + file);
  let pathFile = path + folderName + "/" + file;
  fs.readFile(pathFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    const updatedDataStr = data.replace(/"id": \d+,?\s*/g, '');

    let jsonData  = JSON.parse(updatedDataStr);
    jsonData.filePath = pathFile;
    
    indexFixture += 1;
    jsonData.id = indexFixture;
    
   
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Écrire le nouveau contenu dans le fichier JSON
    fs.writeFile(pathFile, updatedData, 'utf8', err => {
        if (err) {
            console.error('Erreur d\'écriture dans le fichier:', err);
            return;
        }
        console.log('Les objets avec une clé "id" ont été supprimés avec succès.');
    });

  
  });

}

//convert();