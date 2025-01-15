# WEBHOOKS

Un **webhook** es una forma de que una aplicación pueda enviar información en tiempo real a otra aplicación. Básicamente, es un sistema que permite que tu servidor reciba automáticamente notificaciones de eventos que ocurren en otra plataforma, en este caso, **Stripe**.

## **¿Qué es un webhook en términos simples?**

Piensa en un webhook como una "alerta" o "notificación" que Stripe envía a tu servidor cuando algo importante sucede. Por ejemplo:

- Alguien realiza un pago.
- Un suscriptor cancela su suscripción.
- Un pago falla.

Tu servidor recibe esa alerta (en forma de una solicitud HTTP `POST` con datos específicos del evento) y puede procesarla automáticamente, sin que tú tengas que verificar manualmente en el panel de Stripe.

---

## **¿Por qué son útiles los webhooks?**

Los webhooks son útiles porque te permiten reaccionar automáticamente a eventos que ocurren en Stripe. En lugar de tener que consultar constantemente la API de Stripe para verificar cambios, Stripe "te avisa" cuando algo sucede. Esto reduce la carga de trabajo de tu servidor y hace que tu aplicación sea más eficiente.

---

## **Casos comunes para usar webhooks en Stripe**

En una aplicación que utiliza Stripe como plataforma de pagos, podrías usar webhooks para:

1. **Confirmar pagos exitosos:**
   - Cuando un cliente completa un pago, Stripe envía un evento llamado `payment_intent.succeeded`. Tu servidor puede recibir esta notificación y actualizar la base de datos para marcar el pedido como pagado.

2. **Manejar suscripciones:**
   - Si estás usando Stripe para suscripciones, puedes usar webhooks para reaccionar a eventos como:
     - `invoice.payment_succeeded`: Una factura de suscripción ha sido pagada correctamente.
     - `customer.subscription.deleted`: Un cliente ha cancelado su suscripción.

3. **Detectar pagos fallidos:**
   - Por ejemplo, si ocurre un error en el pago, Stripe puede enviar un evento `invoice.payment_failed`. Tu aplicación podría usar esto para enviar un correo electrónico al cliente informándole del problema.

4. **Enviar confirmaciones por correo:**
   - Después de que se complete un pago, puedes usar un webhook para enviar un correo electrónico personalizado al cliente, confirmando que el pago fue exitoso.

5. **Actualizar tu base de datos:**
   - Cada vez que algo cambia en Stripe (por ejemplo, un cliente actualiza sus datos de pago), puedes sincronizar esa información en tu base de datos.

6. **Emitir reembolsos:**
   - Stripe puede enviarte un evento `charge.refunded` cuando un reembolso es procesado, y tu aplicación puede usar esa información para actualizar los registros del cliente.

---

## **Cómo funciona un webhook en Stripe**

1. **Stripe detecta un evento en su plataforma:**
   Por ejemplo, un cliente completa un pago.

2. **Stripe envía una solicitud HTTP POST a la URL de tu webhook:**
   - Envía datos en formato JSON que describen el evento (por ejemplo, el ID del pago, la cantidad, el estado, etc.).

3. **Tu servidor recibe y valida el evento:**
   - Stripe incluye una firma en las solicitudes del webhook para asegurarse de que el mensaje proviene de ellos (esto se valida con tu clave secreta de Stripe).
   - Tu servidor analiza los datos y realiza la acción correspondiente.

4. **Stripe espera una respuesta de tu servidor:**
   - Si tu servidor responde con un código HTTP 2xx (por ejemplo, 200), Stripe sabe que procesaste el evento correctamente.
   - Si no, Stripe intentará reenviar el webhook varias veces.

---

## **Pasos para configurar un webhook en Stripe**

1. **Define una URL para recibir los webhooks:**
   - Esto es simplemente un endpoint en tu aplicación (por ejemplo, `/api/webhook`).
   - Esta URL debe ser accesible desde Internet.

2. **Registra el webhook en el panel de Stripe:**
   - Ve a tu [Dashboard de Stripe](https://dashboard.stripe.com/).
   - Navega a la sección de "Desarrolladores" > "Webhooks".
   - Agrega una URL de webhook y selecciona los eventos que deseas escuchar (por ejemplo, `payment_intent.succeeded`, `invoice.payment_failed`, etc.).

3. **Valida las solicitudes de Stripe:**
   - Stripe incluye una firma en el encabezado (`Stripe-Signature`) de cada webhook para garantizar que la solicitud proviene de ellos.
   - Usa una biblioteca como `stripe` (en Node.js, Python, etc.) para validar la firma.

4. **Procesa los eventos:**
   - Dependiendo del evento que recibas, ejecuta lógica específica en tu aplicación. Por ejemplo, si recibes `payment_intent.succeeded`, puedes marcar un pedido como pagado.

---

## **Ejemplo práctico de un flujo con webhooks**

Imagina que tienes una tienda online. Un cliente realiza un pago, y Stripe lo procesa. Luego:

1. **Stripe envía un evento `payment_intent.succeeded` a tu webhook:**

   ```json
   {
     "id": "evt_123456789",
     "type": "payment_intent.succeeded",
     "data": {
       "object": {
         "id": "pi_987654321",
         "amount": 5000,
         "currency": "usd",
         "status": "succeeded"
       }
     }
   }
   ```

2. **Tu servidor recibe y valida el evento.**
   - Compruebas que la firma sea válida.
   - Procesas los datos, por ejemplo, actualizando tu base de datos para marcar el pedido como pagado.

3. **Stripe recibe una respuesta exitosa:**
   - Stripe deja de intentar reenviar el webhook.

---

## **Ventajas de usar webhooks en Stripe**

- **Automatización:** Reacciona automáticamente a los eventos en Stripe sin intervención manual.
- **Sincronización en tiempo real:** Mantén tu base de datos actualizada con los estados de los pagos.
- **Eficiencia:** No necesitas hacer constantes consultas a la API de Stripe; ellos te notifican cuando algo sucede.
