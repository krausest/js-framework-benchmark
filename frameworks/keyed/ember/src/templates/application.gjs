import { TheTable } from '#components/the-table.gjs';
import { Jumbotron } from '#components/jumbotron.gjs';

<template>
  <div id="main">
    <div class="container">
      <Jumbotron />
      <TheTable />

      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>
