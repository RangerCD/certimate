package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/usual2970/certimate/internal/domain"
	"github.com/usual2970/certimate/internal/utils/app"
)

type AccessRepository struct{}

func NewAccessRepository() *AccessRepository {
	return &AccessRepository{}
}

func (a *AccessRepository) GetById(ctx context.Context, id string) (*domain.Access, error) {
	record, err := app.GetApp().Dao().FindRecordById("access", id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrRecordNotFound
		}
		return nil, err
	}

	rs := &domain.Access{
		Meta: domain.Meta{
			Id:      record.GetId(),
			Created: record.GetTime("created"),
			Updated: record.GetTime("updated"),
		},
		Name:       record.GetString("name"),
		Config:     record.GetString("config"),
		ConfigType: record.GetString("configType"),
		Usage:      record.GetString("usage"),
	}
	return rs, nil
}
