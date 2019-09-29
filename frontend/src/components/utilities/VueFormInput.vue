<template>
  <div :class="label ? 'vf-labeled' : ''">
    <slot />
    <label v-if="label">{{ label }}</label>
    <div v-if="type === 'text' || type === 'email'">
      <vue-masked-input
        v-if="mask"
        v-model="maskedInput"
        :mask="mask"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        class="form-control"
        @input="$emit('input', maskedInput)"
      />
      <input
        v-else
        :value="value"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        class="form-control"
        @input="$emit('input', $event.target.value)"
      />
    </div>

    <vue-password
      v-if="type === 'password'"
      v-model="password"
      :placeholder="placeholder"
      :score="passwordScore"
      @input="updateScore"
    />

    <field-messages :state="formstate" :name="name" show="$touched || $submitted">
      <template>
        <span class="glyphicon glyphicon-ok form-control-feedback" />
      </template>

      <template v-for="(message, key) in messages" :slot="key">
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <span class="glyphicon glyphicon-remove form-control-feedback" />
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <span class="has-error">{{ message }}</span>
      </template>

      <!--The template below is for password validation suggestions-->
      <template :slot="'notStrong'">
        <span class="glyphicon glyphicon-remove form-control-feedback" />
        <div v-for="suggestion in suggestions" :key="suggestion">
          <span class="glyphicon glyphicon-remove form-control-feedback" />
          <span class="has-error">{{ suggestion }}</span>
        </div>
      </template>
    </field-messages>
  </div>
</template>

<script>
/* eslint-disable vue/require-v-for-key */
import { userService, eventBus } from '../../services';
import { EVENTS } from '../../config';

import _ from 'lodash';

export default {
  props: ['value', 'mask', 'formstate', 'type', 'name', 'placeholder', 'label', 'messages'],
  data() {
    return {
      password: '',
      passwordScore: 0,
      suggestions: [],
      maskedInput: '',
    };
  },
  methods: {
    // Make sure to debounce the password score update
    updateScore: _.debounce(function(password, userInputs) {
      this.$emit('input', password);
      eventBus.$emit(EVENTS.UPDATING_PASSWORD_SCORE);
      userService.checkPassword(password, userInputs).then(result => {
        this.passwordScore = result.data.score;
        this.suggestions = result.data.suggestions;
        eventBus.$emit(EVENTS.PASSWORD_SCORE_UPDATED, this.passwordScore);
      });
    }, 250),
  },
};
</script>
