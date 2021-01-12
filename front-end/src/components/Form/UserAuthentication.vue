<template>
  <div>
		<b-row>
			<b-col sm="12" md="12" lg="12" xl="12">
				<b-form-group label="E-mail*" label-for="email">
					<b-form-input
						id="email"
						class="invision-input"
						v-model="model.email"
						autocomplete="off"
						name="email"
						v-validate="{ required: true }"
						:state="validateState('email')"
					></b-form-input>
				</b-form-group>
			</b-col>
			<b-col sm="12" md="12" lg="12" xl="12">
				<b-form-group label="Senha*" label-for="password">
					<b-form-input
						id="password"
						type="password"
						class="invision-input"
						v-model="model.password"
						autocomplete="off"
						name="password"
						v-validate="{ required: true }"
						:state="validateState('password')"
					></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>
  </div>
</template>

<script>
import RestResourceUsuario from "@/services/usuario";

export default {
  data() {
    return {
      model: {
        email: "",
        password: "",
        permission: "rw_registro_entrada",
      },
      isBusy: false,
    };
	},
	
	props: {},

  methods: {
    async authenticate() {
      let validationResult = await this.$validator.validateAll();
      if (!validationResult) return validationResult;

      this.isBusy = true;
      let result = await RestResourceUsuario.getIfUserHasPermission(this.model);
      this.isBusy = false;

      this.model.password = "";
      if (result.length) {
        this.$emit("authenticationResult", result[0]);
        return true;
      } else {
        swal({
          title: "Usuário não autenticado",
          text:
            "Usuário ou senha incorretos ou o usário não possui permissão para realizar essa ação",
          icon: "error",
          button: "Continuar",
        });

        return false;
      }
    },

    validateState(ref) {
      if (
        this.veeFields[ref] &&
        document.getElementsByName(ref)[0] &&
        !document.getElementsByName(ref)[0].disabled &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },
  },
};
</script>