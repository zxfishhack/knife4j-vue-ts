import SwaggerBootstrapUiInstanceBase from "@/knife4j/SwaggerBootstrapUiInstance"
import KUtils from '@/core/utils'

function resolvedOASVersion(version: string) {
  let vs='2.0';
  if(KUtils.strNotBlank(version)){
    vs=version;
  }
  return vs
}

export default function CreateSwaggerBootstrapUiInstance(id: string, loc: string, version: string) : SwaggerBootstrapUiInstanceBase {
  return new SwaggerBootstrapUiInstanceBase()
}
