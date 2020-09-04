import { Client, Message } from '@open-wa/wa-automate';
import { api, config, tokenParams } from '../services/api'
import { ClientCredentials } from 'simple-oauth2';

interface Operation {
  from: string
  title: string | number
  coop: string
  unity: string
  description: string
  level: number
}

interface MessageDTO {
  from: string
}

interface Contact {
  contact_id: string,
  contact_name: string
  company_name: string
}

interface ContactsResponse {
  contacts: [Contact]
}


let operations: Operation[] = []
export let status = false

const scriptOS = {
  1: 'Qual o nome da sua cooperativa ? (Exemplo: Vale Sul, Ouro Branco, Nossa Terra )',
  2: 'Qual a sua agência ? (Exemplo: 04, UAD, 25, SUREG)',
  3: 'Descreva o motivo da OS. (Exemplo: Ramal 1205 inoperante)',
  4: 'A sua OS foi registrada com sucesso!',
}

const scriptCONTATO = {
  1: `Digite: 
      *1* - Comprar um produto
      *2* - Suporte Técnico
      `,
  2: 'Obrigado, logo nossos atendentes entrarão em contato'

}


async function createOperation(id: number): Promise<boolean> {

  const { coop, unity, description } = operations[id]

  try {

    const client = new ClientCredentials({
      client: {
        id: '1000.CQ7A4R0I7G9Q7JDKRMAL1N2LKF2XKY',
        secret: '06381093ba30f8563267c372895a30f89c0c18c9be'
      },
      auth: {
        tokenHost: 'https://accounts.zoho.com',
        tokenPath: '/oauth/v2/token?'
      },
      options: {
        authorizationMethod: "body"
      }
    });

    const responseToken = await client.getToken(tokenParams);
    const accessToken = responseToken.token.access_token

    const contactsResponse = await api.get<ContactsResponse>('/contacts', {
      params: {
        company_name_contains: coop,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      }
    })

    const contacts = contactsResponse.data.contacts

    if (contacts.length < 0) {
      throw new Error('Cooperativa não encontrada');
    }

    const contact = contacts.find(contact => contact.contact_name.toUpperCase() === `${contact.company_name.toUpperCase()} - ${unity.toUpperCase()}`)

    if (contact === undefined) {
      throw new Error('Agência não encontrada');
    }

    const customer_id = contact.contact_id
    const notes = description
    const line_items = [{ item_id: '2327669000000108154' }]

    await api.post('salesorders',
      {
        customer_id,
        notes,
        line_items
      }
      , {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`
        }
      }
    )
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function verifyCustomer(message: MessageDTO): number {
  const operationIndex = operations.findIndex(operation => operation.from === message.from)
  if (operationIndex >= 0)
    return operationIndex
  else {
    operations.push({
      from: message.from,
      title: '',
      coop: '',
      unity: '',
      description: '',
      level: 1
    })
    return operations.length - 1
  }

}

async function contact(operationIndex: number, message: Message, client: Client) {
  switch (operations[operationIndex].level) {
    case 1:
      await client.sendText(message.from, scriptCONTATO[1])
      operations[operationIndex].level++
      break;
    case 2:
      switch (message.body) {
        case '1':
          await client.sendText('554192724349@c.us', `Pedido de contato para o número: ${message.from.slice(2, 13)}`)
          await client.sendText(message.from, 'Obrigado, em breve entraremos em contato!')
          break;
        case '2':
          await client.sendText('5511952772090@c.us', `Pedido de contato para o número: ${message.from.slice(2, 13)}`)
          await client.sendText(message.from, 'Obrigado, em breve entraremos em contato!')
          break;
        default:
          await client.sendText(message.from, `Opção Invalida`)
      }
      operations.splice(operationIndex, 1)
      break;
  }
}

async function serviceOrder(operationIndex: number, message: Message, client: Client) {
  switch (operations[operationIndex].level) {
    case 1:
      await client.sendText(message.from, scriptOS[1])
      operations[operationIndex].level++
      break;
    case 2:
      operations[operationIndex].coop = message.body
      await client.sendText(message.from, scriptOS[2])
      operations[operationIndex].level++
      break;
    case 3:
      operations[operationIndex].unity = message.body
      await client.sendText(message.from, scriptOS[3])
      operations[operationIndex].level++
      break;
    case 4:
      operations[operationIndex].description = message.body

      const createdOperation = await createOperation(operationIndex)

      if (createdOperation) {
        await client.sendText(message.from, scriptOS[4])
        await client.sendText('5511952772090@c.us', `Nova OS registrada`)

      } else {
        await client.sendText(message.from, `Falha em registrar OS, tente novamente.`)
        await client.sendText('5511952772090@c.us', `Falha de registro de OS`)

      }
      operations.splice(operationIndex, 1)
      break;
  }
}

async function setStatus(client: Client) {
  status = await client.isConnected()
}

async function Whatsapp(client: Client) {
  await setStatus(client)
  client.onMessage(async (message) => {
    const operationIndex = verifyCustomer(message)

    const formatedMessage = message.body

    switch (operations[operationIndex].title) {
      case '':
        client.sendText(message.from,
          `Olá! Eu sou o atendente virtual da Agora IP. Posso te ajudar ? 
        
          *1* - Registrar uma OS
          *2* - Entrar em contato conosco
        `)
        operations[operationIndex].title = 'Waiting'
        break;
      case 'Waiting':
        switch (formatedMessage) {
          case '1':
            operations[operationIndex].title = 'OS'
            break;

          case '2':
            operations[operationIndex].title = 'CONTATO'
            break;

          default:
            await client.sendText(message.from,
              `Não entendi muito bem, atualmente podemos:
              *1* - Registrar uma OS
              *2* - Entrar em contato conosco
            `)
            return;
        }
        break;
    }

    if (operations[operationIndex].title !== '' && operations[operationIndex].title !== 'Waiting') {
      switch (operations[operationIndex].title) {
        case 'OS':
          serviceOrder(operationIndex, message, client)
          break;

        case 'CONTATO':
          contact(operationIndex, message, client)
          break;
      }
    }
  })
}

export default Whatsapp
