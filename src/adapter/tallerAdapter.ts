import tallerDAO from "../dao/tallerDAO";
import {
  TallerAttributes,
  TallerCreationAttributes,
  TallerInstance,
} from "../types";

const getById = (
  IdTaller: string
): Promise<TallerAttributes | null> | undefined => tallerDAO.getById(IdTaller);

const getAll = (): Promise<TallerInstance[]> => tallerDAO.findAll();

const create = (
  taller: TallerCreationAttributes
): Promise<TallerInstance> | undefined => tallerDAO.create(taller);

const update = (
  IdTaller: number,
  taller: TallerCreationAttributes
): Promise<[affectedCount: number]> | undefined =>
  tallerDAO.update(IdTaller, taller);

const deleteById = (IdTaller: number): Promise<number> | undefined =>
  tallerDAO.deleteById(IdTaller);

export default {
  getById,
  getAll,
  create,
  update,
  deleteById,
};
