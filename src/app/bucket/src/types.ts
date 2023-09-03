import { z } from "zod"
import { ReactElement } from "react"
import { AllFieldTypes } from "./field-types"
import * as FieldTypesModule from "./field-types"

export interface ConfigValidation {
  hasAWSAccess: boolean
  hasAWSSecret: boolean
  hasAWSRegion: boolean
  hasAWSBucket: boolean
}

export type FieldKeys = keyof typeof FieldTypesModule
export type SetDataFunction<T> = (data: Partial<T>) => void

export interface FieldType<T, P = any> {
  schema: z.ZodType<T, any, any>
  renderAdmin: (props: P) => ReactElement
  validate: (data: T) => { isValid: boolean; errorMessage?: string }
}

export interface FieldTypeProps<T> {
  data: T
  setData: SetDataFunction<T>
  fieldOptions?: T // Renamed this to fieldOptions
}

export interface SelectFieldTypeProps<T> extends Omit<FieldTypeProps<T>, "fieldOptions"> {
  options: string[] // Explicitly specify that options should be string[]
}

export interface BaseField {
  name: string
  typeName: FieldKeys
}

export interface SelectField extends BaseField {
  typeName: "SelectField"
  options: string[]
}

export type FieldTypes = Record<FieldKeys, FieldType<AllFieldTypes>>
export type Field = BaseField | SelectField

export interface Collection {
  name: string
  fields: Field[]
}

export interface CollectionFetch extends Collection {} // If they are same, just extend. Otherwise, keep them separate.

export interface AvailableFieldType {
  name: string
  component: FieldType<any, any>
}

export interface ItemFormFieldData {
  name: string
  data: Partial<AllFieldTypes> // If you're not sure of the exact shape, use Partial
  options?: string[]
}

export interface CollectionItemData {
  itemId: string
  itemName: string
  data: AllFieldTypes
}

export interface ItemFormData {
  collectionName: string
  fields: ItemFormFieldData[]
}

export interface CollectionData {
  collectionName: string
  itemCount: number
}
