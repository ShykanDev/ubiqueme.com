<script setup lang="ts">
import HomeLayout from '@/layouts/HomeLayout.vue';
</script>

<template>
  <HomeLayout>
    <template #main>
      <div class="legal-page">
        <div class="legal-wrapper">
          <header class="legal-header">
            <h1>Política de Privacidad</h1>
            <p class="subtitle">Transparencia y protección de datos en Ubiqueme</p>
            <div class="meta-info">Última actualización: Mayo 2026</div>
          </header>

          <div class="legal-content">
            <section>
              <h3>Alcance del Servicio</h3>
              <p>
                Ubiqueme se compromete a proteger la privacidad de sus usuarios. Este documento describe el tratamiento de la información gestionada a través de nuestra plataforma de retransmisión de notificaciones privadas.
              </p>
            </section>

            <section>
              <h3>Recopilación de Información</h3>
              <p>
                Para la correcta prestación del servicio, se gestionan los siguientes datos bajo estrictos protocolos de confidencialidad:
              </p>
              <ul>
                <li>Información de contacto necesaria para la recepción de alertas.</li>
                <li>Identificadores únicos asociados a los códigos físicos.</li>
                <li>Registros de actividad para la optimización de entrega de mensajes.</li>
              </ul>
            </section>

            <section>
              <h3>Protocolo "Privacy Relay"</h3>
              <p>
                Nuestra arquitectura técnica garantiza que la identidad y los datos de contacto del propietario permanezcan ocultos en todo momento. El sistema actúa como un intermediario cifrado, facilitando la comunicación sin exponer información sensible a terceros durante el proceso de recuperación de pertenencias.
              </p>
            </section>

            <section>
              <h3>Seguridad y Resguardo</h3>
              <p>
                Los datos son tratados mediante infraestructura de alta disponibilidad y cifrado estándar de la industria. El acceso a la información está restringido exclusivamente a las funciones necesarias para la operación del servicio y el cumplimiento de requerimientos legales.
              </p>
            </section>

            <section>
              <h3>Derechos del Usuario</h3>
              <p>
                Usted mantiene el control total sobre su información. En cualquier momento puede modificar o eliminar sus datos de contacto a través de las herramientas proporcionadas en su panel de administración.
              </p>
            </section>

            <section>
              <h3>Contacto</h3>
              <p>
                Para cualquier consulta relacionada con el tratamiento de su información o para ejercer sus derechos de privacidad, puede dirigirse a nuestro departamento de gestión de datos a través del correo electrónico: <strong>soporte@ubiqueme.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<style scoped>
.legal-page {
  background-color: #09090b;
  min-height: 100vh;
  padding: 120px 20px 80px;
}

.legal-wrapper {
  max-width: 700px;
  margin: 0 auto;
}

.legal-header {
  margin-bottom: 64px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.04em;
  margin-bottom: 8px;
}

.subtitle {
  color: #f97316;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.meta-info {
  color: #52525b;
  font-size: 0.8rem;
}

.legal-content {
  color: #a1a1aa;
  font-size: 1rem;
  line-height: 1.7;
}

section {
  margin-bottom: 40px;
}

h3 {
  color: #fafafa;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

p {
  margin-bottom: 16px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

li::before {
  content: "•";
  color: #f97316;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  .legal-page { padding-top: 100px; }
}
</style>
