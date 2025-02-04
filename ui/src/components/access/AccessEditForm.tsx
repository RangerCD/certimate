import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreation, useDeepCompareEffect } from "ahooks";
import { Form, Input } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

import { ACCESS_PROVIDER_TYPES, type AccessModel } from "@/domain/access";
import AccessTypeSelect from "./AccessTypeSelect";
import AccessEditFormACMEHttpReqConfig from "./AccessEditFormACMEHttpReqConfig";
import AccessEditFormAliyunConfig from "./AccessEditFormAliyunConfig";
import AccessEditFormAWSConfig from "./AccessEditFormAWSConfig";
import AccessEditFormBaiduCloudConfig from "./AccessEditFormBaiduCloudConfig";
import AccessEditFormBytePlusConfig from "./AccessEditFormBytePlusConfig";
import AccessEditFormCloudflareConfig from "./AccessEditFormCloudflareConfig";
import AccessEditFormDogeCloudConfig from "./AccessEditFormDogeCloudConfig";
import AccessEditFormGoDaddyConfig from "./AccessEditFormGoDaddyConfig";
import AccessEditFormHuaweiCloudConfig from "./AccessEditFormHuaweiCloudConfig";
import AccessEditFormKubernetesConfig from "./AccessEditFormKubernetesConfig";
import AccessEditFormLocalConfig from "./AccessEditFormLocalConfig";
import AccessEditFormNameSiloConfig from "./AccessEditFormNameSiloConfig";
import AccessEditFormPowerDNSConfig from "./AccessEditFormPowerDNSConfig";
import AccessEditFormQiniuConfig from "./AccessEditFormQiniuConfig";
import AccessEditFormSSHConfig from "./AccessEditFormSSHConfig";
import AccessEditFormTencentCloudConfig from "./AccessEditFormTencentCloudConfig";
import AccessEditFormVolcEngineConfig from "./AccessEditFormVolcEngineConfig";
import AccessEditFormWebhookConfig from "./AccessEditFormWebhookConfig";

type AccessEditFormModelType = Partial<MaybeModelRecord<AccessModel>>;
type AccessEditFormModes = "add" | "edit";

export type AccessEditFormProps = {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  mode: AccessEditFormModes;
  model?: AccessEditFormModelType;
  onModelChange?: (model: AccessEditFormModelType) => void;
};

export type AccessEditFormInstance = {
  getFieldsValue: () => AccessEditFormModelType;
  resetFields: () => void;
  validateFields: () => Promise<AccessEditFormModelType>;
};

const AccessEditForm = forwardRef<AccessEditFormInstance, AccessEditFormProps>(({ className, style, disabled, loading, mode, model, onModelChange }, ref) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    name: z
      .string({ message: t("access.form.name.placeholder") })
      .trim()
      .min(1, t("access.form.name.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 })),
    configType: z.nativeEnum(ACCESS_PROVIDER_TYPES, { message: t("access.form.type.placeholder") }),
    config: z.any(),
  });
  const formRule = createSchemaFieldRule(formSchema);
  const [form] = Form.useForm<z.infer<typeof formSchema>>();

  const [initialValues, setInitialValues] = useState<Partial<z.infer<typeof formSchema>>>(model as Partial<z.infer<typeof formSchema>>);
  useDeepCompareEffect(() => {
    setInitialValues(model as Partial<z.infer<typeof formSchema>>);
  }, [model]);

  const [configType, setConfigType] = useState(model?.configType);
  useEffect(() => {
    setConfigType(model?.configType);
  }, [model?.configType]);

  const [configFormInst] = Form.useForm();
  const configFormName = useCreation(() => `accessEditForm_config${Math.random().toString(36).substring(2, 10)}${new Date().getTime()}`, []);
  const configFormComponent = useMemo(() => {
    /*
      注意：如果追加新的子组件，请保持以 ASCII 排序。
      NOTICE: If you add new child component, please keep ASCII order.
     */
    const configFormProps = { form: configFormInst, formName: configFormName, disabled: disabled, loading: loading, model: model?.config };
    switch (configType) {
      case ACCESS_PROVIDER_TYPES.ACMEHTTPREQ:
        return <AccessEditFormACMEHttpReqConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.ALIYUN:
        return <AccessEditFormAliyunConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.AWS:
        return <AccessEditFormAWSConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.BAIDUCLOUD:
        return <AccessEditFormBaiduCloudConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.BYTEPLUS:
        return <AccessEditFormBytePlusConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.CLOUDFLARE:
        return <AccessEditFormCloudflareConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.DOGECLOUD:
        return <AccessEditFormDogeCloudConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.GODADDY:
        return <AccessEditFormGoDaddyConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.HUAWEICLOUD:
        return <AccessEditFormHuaweiCloudConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.KUBERNETES:
        return <AccessEditFormKubernetesConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.LOCAL:
        return <AccessEditFormLocalConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.NAMESILO:
        return <AccessEditFormNameSiloConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.POWERDNS:
        return <AccessEditFormPowerDNSConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.QINIU:
        return <AccessEditFormQiniuConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.SSH:
        return <AccessEditFormSSHConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.TENCENTCLOUD:
        return <AccessEditFormTencentCloudConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.VOLCENGINE:
        return <AccessEditFormVolcEngineConfig {...configFormProps} />;
      case ACCESS_PROVIDER_TYPES.WEBHOOK:
        return <AccessEditFormWebhookConfig {...configFormProps} />;
    }
  }, [model, configType, configFormInst]);

  const handleFormProviderChange = (name: string) => {
    if (name === configFormName) {
      form.setFieldValue("config", configFormInst.getFieldsValue());
      onModelChange?.(form.getFieldsValue(true));
    }
  };

  const handleFormChange = (_: unknown, fields: AccessEditFormModelType) => {
    if (fields.configType !== configType) {
      setConfigType(fields.configType);
    }

    onModelChange?.(fields);
  };

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      return form.getFieldsValue(true);
    },
    resetFields: () => {
      return form.resetFields();
    },
    validateFields: () => {
      const t1 = form.validateFields();
      const t2 = configFormInst.validateFields();
      return Promise.all([t1, t2]).then(() => t1);
    },
  }));

  return (
    <Form.Provider onFormChange={handleFormProviderChange}>
      <div className={className} style={style}>
        <Form form={form} disabled={loading || disabled} initialValues={initialValues} layout="vertical" onValuesChange={handleFormChange}>
          <Form.Item name="name" label={t("access.form.name.label")} rules={[formRule]}>
            <Input placeholder={t("access.form.name.placeholder")} />
          </Form.Item>

          <Form.Item
            name="configType"
            label={t("access.form.type.label")}
            rules={[formRule]}
            tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.type.tooltip") }}></span>}
          >
            <AccessTypeSelect disabled={mode !== "add"} placeholder={t("access.form.type.placeholder")} showSearch={!disabled} />
          </Form.Item>
        </Form>

        {configFormComponent}
      </div>
    </Form.Provider>
  );
});

export default AccessEditForm;
