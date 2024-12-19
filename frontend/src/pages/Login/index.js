import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import { openApi } from "../../services/api";
import { toast } from "react-toastify";
import usePlans from "../../hooks/usePlans";
import moment from "moment";
import { i18n } from "../../translate/i18n";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";
import ContactPhone from "@material-ui/icons/ContactPhone";

import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import logImg from "./img/log.svg";
import registerImg from "./img/register.svg";
import toastError from "../../errors/toastError";

import "./style.css";

const useStyles = makeStyles((theme) => ({
  inputField: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding: "0px",
    "& .MuiInputLabel-root": {
      color: "#1E1F20",
    },
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#004A77",
    color: "white",
  },
  footersigninsignup: {
    justifyContent: "center",
    backgroundColor: "red",
  },
}));

const LoginSignup = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const { handleLogin, handleSignup } = useContext(AuthContext);
  const history = useHistory();

  const [plans, setPlans] = useState([]);
  const { list: listPlans } = usePlans();
  const dueDate = moment().add(3, "day").format();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
  }, []);

  const handleSignUp = async (values) => {
    Object.assign(values, { recurrence: "MENSAL" });
    Object.assign(values, { dueDate: dueDate });
    Object.assign(values, { status: "t" });
    Object.assign(values, { campaignsEnabled: true });
    try {
      await openApi.post("/companies/cadastro", values);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  };

  const SignInForm = () => (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email("Email inválido").required("Obrigatório"),
        password: Yup.string().required("Obrigatório"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await handleLogin({ email: values.email, password: values.password });
        } catch (error) {
          toastError(error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="sign-in-form">
          <Logo
            className={clsx(classes.logo, {
              [classes.logoLight]: theme.palette.mode === "light",
              [classes.logoDark]: theme.palette.mode === "dark",
            })} style={{ width: "50%" }}
            alt="logo"
          />

          <div className="input-field">
            <InputAdornment position="start">
              <PersonIcon style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              label={i18n.t("login.form.email")}
              fullWidth
              className={classes.inputField}
              type="email"
              name="email"
            />
          </div>
          <div className="input-field">
            <InputAdornment position="start">
              <LockIcon style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              label={i18n.t("login.form.password")}
              fullWidth
              className={classes.inputField}
              type="password"
              name="password"
            />
          </div>

          <Grid container >
					  <Grid item xs={9} style={{ textAlign: "right"}}>
						<Link component={RouterLink} to="/forgetpsw" variant="body2">
						  Esqueceu sua senha?
						</Link>
					  </Grid>
					</Grid>

          <Button type="submit" style={{ width: "200px", backgroundColor: "#004A77", borderRadius: "12px", marginTop: "5px", height: "50px", color: "white" }} variant="contained" color="primary" className={classes.submitButton} disabled={isSubmitting}>
            Entrar
          </Button>

          <div className="footersigninsignup" display="Flex" flexDirection="row" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", marginTop: "15px" }}>
              This site is protected by reCAPTCHA Enterprise and the Google{" "}
              <a href={"https://policies.google.com/privacy"} target={"_blank"}>
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href={"https://policies.google.com/terms"} target={"_blank"}>
                Terms of Service
              </a>
            </p>
            <p className="p" style={{ fontSize: "10px", marginTop: "1px" }}>
              Copyright ©{" "}
              <a href={"#"} target={"_blank"}>
                Seu App{""}
              </a>{" "}
              2024{" "}
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );

  const SignUpForm = () => (
    <Formik
      initialValues={{
        name: "",
        email: "",
        phone: "",
        password: "",
        planId: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(2, "Muito curto!")
          .max(50, "Muito longo!")
          .required("Obrigatório"),
        email: Yup.string().email("Email inválido").required("Obrigatório"),
        password: Yup.string().min(5, "Muito curto!").max(50, "Muito longo!"),
        phone: Yup.string()
          .required("Obrigatório"),
      })}
      onSubmit={handleSignUp}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form className={classes.form}>
          <Logo
            className={clsx(classes.logo, {
              [classes.logoLight]: theme.palette.mode === "light",
              [classes.logoDark]: theme.palette.mode === "dark",
            })} style={{ width: "50%" }}
            alt="logo"
          />
          <div className="input-field">
            <InputAdornment position="start">
              <PersonIcon style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              label={i18n.t("signup.form.name")}
              fullWidth
              className={classes.inputField}
              type="text"
              name="name"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
          </div>
          <div className="input-field">
            <InputAdornment position="start">
              <ContactPhone style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              margin="dense"
              fullWidth
              className={classes.inputField}
              id="phone"
              label="Telefone com (DDD)"
              name="phone"
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              autoComplete="phone"
              required
            />
          </div>
          <div className="input-field">
            <InputAdornment position="start

">
              <EmailIcon style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              label={i18n.t("signup.form.email")}
              fullWidth
              className={classes.inputField}
              type="email"
              name="email"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </div>
          <div className="input-field">
            <InputAdornment position="start">
              <LockIcon style={{ marginLeft: "15px", marginTop: "55px", color: "#004A77" }} />
            </InputAdornment>
            <Field
              as={TextField}
              label={i18n.t("signup.form.password")}
              fullWidth
              className={classes.inputField}
              type="password"
              name="password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </div>
          <div className="input-field">
            <InputLabel style={{ marginLeft: "0px", marginTop: "20px", color: "#004A77" }} htmlFor="plan-selection">Planos</InputLabel>
            <Field
              as={Select}
              margin="dense"
              fullWidth
              id="plan-selection"
              label="Plano"
              name="planId"
              required
            >
              {plans.map((plan, key) => (
                <MenuItem key={key} value={plan.id}>
                  {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
                  {plan.connections} - Filas: {plan.queues} - R$ {plan.value}
                </MenuItem>
              ))}
            </Field>
          </div>
          <a style={{ fontSize: "12px" }} href="https://www.google.com.br">Conheça nossos Planos</a>

          <Button style={{ width: "200px", backgroundColor: "#004A77", borderRadius: "12px", marginTop: "5px", height: "50px", color: "white" }}
            type="submit"
            disabled={isSubmitting}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {i18n.t("signup.buttons.submit")}
          </Button>
          <div className="footersigninsignup" display="Flex" flexDirection="row" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", marginTop: "15px" }}>
              This site is protected by reCAPTCHA Enterprise and the Google{" "}
              <a href={"https://policies.google.com/privacy"} target={"_blank"}>
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href={"https://policies.google.com/terms"} target={"_blank"}>
                Terms of Service
              </a>
            </p>
            <p className="p" style={{ fontSize: "10px", marginTop: "1px" }}>
              Copyright ©{" "}
              <a href={"#"} target={"_blank"}>
                Seu App{""}
              </a>{" "}
              2024{" "}
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className={`containersignin ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-containersignin">
        <div className="signin-signup">
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>

      <div className="panels-containersignin">
        <div className="panel left-panel">
          <div className="content">
            <h3>Novo por aqui ?</h3>
            <p>
              Crie sua conta para ter acesso a todas as funcionalidades da plataforma.
            </p>
            <button style={{ borderRadius: "12px" }} className="btn transparent" id="sign-up-btn" onClick={() => setIsSignUp(true)}>
              CADASTRAR-SE
            </button>
          </div>
          <img src={logImg} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Já é um membro ?</h3>
            <p>
              Faça login para acessar sua conta e gerenciar seus atendimentos.
            </p>
            <button style={{ borderRadius: "12px" }} className="btn transparent" id="sign-in-btn" onClick={() => setIsSignUp(false)}>
              ENTRAR
            </button>
          </div>
          <img src={registerImg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
