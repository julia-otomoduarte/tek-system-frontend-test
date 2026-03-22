<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh">
    <div class="text-center">
      <div class="text-h1 font-weight-bold text-primary mb-2">404</div>
      <div class="text-h6 font-weight-bold mb-2">Página não encontrada</div>
      <p class="text-body-2 text-medium-emphasis mb-6">
        A página que você está procurando não existe ou foi removida.
      </p>
      <VBtn color="primary" :to="{ name: 'dashboard' }">Voltar para o início</VBtn>
    </div>
  </div>
</template>
